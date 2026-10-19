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

  it('supports number keys for answers without overriding an active form input', async () => {
    const user = userEvent.setup()
    render(<QuestionCard question={question} onResult={vi.fn()} />)

    await user.keyboard('2')
    expect(screen.getByRole('radio', { name: 'Answer 54' })).toBeChecked()
    expect(screen.getByText('Selected')).toBeInTheDocument()

    const { unmount } = render(
      <>
        <input aria-label="Notes" />
        <QuestionCard question={question} onResult={vi.fn()} />
      </>,
    )
    await user.click(screen.getByLabelText('Notes'))
    await user.keyboard('2')
    expect(
      screen.getAllByRole('button', { name: 'Flip card' })[1],
    ).toBeDisabled()
    unmount()
  })

  it('announces new questions and revealed answers for screen readers', async () => {
    const user = userEvent.setup()
    render(<QuestionCard question={question} onResult={vi.fn()} />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'New question: 7 x 8 = ?',
    )
    await user.click(screen.getByRole('radio', { name: 'Answer 56' }))
    await user.click(screen.getByRole('button', { name: 'Flip card' }))
    expect(screen.getByRole('status')).toHaveTextContent(
      'The correct answer is 56.',
    )
  })

  it('disables card animation when reduced motion is preferred', () => {
    const addEventListener = vi.fn()
    const removeEventListener = vi.fn()
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: true,
        addEventListener,
        removeEventListener,
      }),
    )
    const { unmount } = render(
      <QuestionCard question={question} animationsEnabled onResult={vi.fn()} />,
    )

    expect(screen.getByRole('status').parentElement).toHaveClass(
      'question-card--no-animation',
    )
    unmount()
    expect(removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    )
    vi.unstubAllGlobals()
  })
})
