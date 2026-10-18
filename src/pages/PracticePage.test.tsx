import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { loadMistakePatterns, saveMistakePatterns } from '../services/storage'

async function startFixedSession(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('link', { name: 'Start practice' }))
  await user.click(screen.getByLabelText('Addition'))
  await user.click(screen.getByLabelText('Level 1: Beginner'))
  await user.click(screen.getByLabelText('5 questions'))
  await user.click(screen.getByRole('button', { name: 'Start practice' }))
}

async function reportCorrectAnswer(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getAllByRole('radio')[0])
  await user.click(screen.getByRole('button', { name: 'Flip card' }))
  await user.click(screen.getByRole('button', { name: 'I got it right' }))
}

describe('practice sessions', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('advances through a fixed session and displays an accurate summary', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startFixedSession(user)
    expect(
      screen.getByRole('heading', { name: 'Question 1 of 5' }),
    ).toBeInTheDocument()

    await reportCorrectAnswer(user)
    expect(
      screen.getByRole('heading', { name: 'Question 2 of 5' }),
    ).toBeInTheDocument()

    await reportCorrectAnswer(user)
    await reportCorrectAnswer(user)
    await reportCorrectAnswer(user)
    await reportCorrectAnswer(user)

    expect(
      screen.getByRole('heading', { name: 'Nice work!' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Attempted').nextSibling).toHaveTextContent('5')
    expect(screen.getByText('Correct').nextSibling).toHaveTextContent('5')
    expect(screen.getByText('Accuracy').nextSibling).toHaveTextContent('100%')

    await user.click(screen.getByRole('button', { name: 'Practice again' }))
    expect(
      screen.getByRole('heading', { name: 'Question 1 of 5' }),
    ).toBeInTheDocument()
  })

  it('supports ending a continuous session and reports zero attempts safely', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Start practice' }))
    await user.click(screen.getByLabelText('Division'))
    await user.click(screen.getByLabelText('Level 3: Intermediate'))
    await user.click(screen.getByLabelText('Keep going'))
    await user.click(screen.getByRole('button', { name: 'Start practice' }))

    expect(
      screen.getByRole('heading', { name: 'Questions completed: 0' }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'End session' }))
    expect(screen.getByText('Accuracy').nextSibling).toHaveTextContent('0%')
  })

  it('asks before ending a continuous session with completed questions', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Start practice' }))
    await user.click(screen.getByLabelText('Addition'))
    await user.click(screen.getByLabelText('Level 1: Beginner'))
    await user.click(screen.getByLabelText('Keep going'))
    await user.click(screen.getByRole('button', { name: 'Start practice' }))
    await reportCorrectAnswer(user)
    await user.click(screen.getByRole('button', { name: 'End session' }))

    expect(confirm).toHaveBeenCalledOnce()
    expect(
      screen.getByRole('heading', { name: 'Questions completed: 1' }),
    ).toBeInTheDocument()
    confirm.mockRestore()
  })

  it('records an incorrect regular-practice question as a mistake pattern', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startFixedSession(user)
    await user.click(screen.getAllByRole('radio')[0])
    await user.click(screen.getByRole('button', { name: 'Flip card' }))
    await user.click(screen.getByRole('button', { name: 'I got it wrong' }))

    expect(loadMistakePatterns()).toHaveLength(1)
    expect(loadMistakePatterns()[0]).toMatchObject({
      incorrectCount: 1,
      isMastered: false,
    })
  })

  it('disables mistake review until an active pattern exists', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Start practice' }))

    expect(screen.getByLabelText('Practice mistakes')).toBeDisabled()
    expect(
      screen.getByText(/unavailable until you have an active mistake/i),
    ).toBeInTheDocument()
  })

  it('runs a review session and marks a pattern mastered at the configured threshold', async () => {
    saveMistakePatterns([
      {
        id: 'addition:2:3:difficulty-2',
        operation: 'addition',
        firstOperand: 2,
        secondOperand: 3,
        correctAnswer: 5,
        difficulty: 2,
        lastIncorrectAt: '2026-10-18T10:00:00.000Z',
        incorrectCount: 1,
        similarCorrectCount: 0,
        isMastered: false,
      },
    ])
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Start practice' }))
    await user.click(screen.getByLabelText('Practice mistakes'))
    await user.click(screen.getByRole('button', { name: 'Start practice' }))

    await reportCorrectAnswer(user)
    await reportCorrectAnswer(user)
    await reportCorrectAnswer(user)

    expect(
      screen.getByRole('heading', { name: 'Nice work!' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Mistake-review questions:').parentElement,
    ).toHaveTextContent('3')
    expect(loadMistakePatterns()[0]).toMatchObject({
      similarCorrectCount: 3,
      isMastered: true,
    })
  })
})
