import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Question } from '../../types/math'
import { QuestionCard } from './QuestionCard'

const question: Question = {
  id: 'question-1',
  operation: 'multiplication',
  firstOperand: 7,
  secondOperand: 8,
  displayText: '7 x 8 = ?',
  correctAnswer: 56,
  choices: [48, 54, 56, 64],
  difficulty: 2,
  source: 'regular',
}

describe('QuestionCard', () => {
  it('requires an answer before flipping and reveals the selected and correct answers', async () => {
    const user = userEvent.setup()
    render(<QuestionCard question={question} onResult={vi.fn()} />)
    const flipButton = screen.getByRole('button', { name: 'Flip card' })
    expect(flipButton).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: 'Answer 54' }))
    expect(flipButton).toBeEnabled()
    await user.click(flipButton)

    expect(screen.getByText('Your answer:')).toHaveTextContent('54')
    expect(screen.getByText('Correct answer:')).toHaveTextContent('56')
  })

  it('records a self-reported result once and resets for a new question', async () => {
    const user = userEvent.setup()
    const onResult = vi.fn()
    const { rerender } = render(
      <QuestionCard question={question} onResult={onResult} />,
    )
    await user.click(screen.getByRole('radio', { name: 'Answer 56' }))
    await user.click(screen.getByRole('button', { name: 'Flip card' }))
    await user.click(screen.getByRole('button', { name: 'I got it right' }))
    await user.click(screen.getByRole('button', { name: 'I got it wrong' }))
    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith({
      selectedAnswer: 56,
      selfReportedCorrect: true,
    })

    rerender(
      <QuestionCard
        question={{ ...question, id: 'question-2' }}
        onResult={onResult}
      />,
    )
    expect(screen.getByRole('button', { name: 'Flip card' })).toBeDisabled()
  })
})
