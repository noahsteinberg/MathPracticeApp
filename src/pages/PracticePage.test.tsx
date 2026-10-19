import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { feedbackMessages } from '../services/feedback'
import {
  loadActiveSession,
  loadMistakePatterns,
  saveMistakePatterns,
  saveSettings,
} from '../services/storage'

async function startFixedSession(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('link', { name: 'Start practice' }))
  await user.click(screen.getByRole('button', { name: 'Clear selection' }))
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
    expect(
      screen
        .getAllByRole('status')
        .some((status) =>
          status.textContent?.includes('Session progress: Question 1 of 5.'),
        ),
    ).toBe(true)

    await reportCorrectAnswer(user)
    expect(
      screen
        .getAllByRole('status')
        .some((status) =>
          feedbackMessages.correctMessages.includes(status.textContent ?? ''),
        ),
    ).toBe(true)
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
    expect(loadActiveSession()).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Practice again' }))
    expect(
      screen.getByRole('heading', { name: 'Question 1 of 5' }),
    ).toBeInTheDocument()
  }, 10_000)

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
    expect(
      screen
        .getAllByRole('status')
        .some((status) =>
          feedbackMessages.supportiveMessages.includes(
            status.textContent ?? '',
          ),
        ),
    ).toBe(true)
  })

  it('does not show feedback messages when they are disabled in settings', async () => {
    saveSettings({
      soundEffectsEnabled: true,
      cardAnimationsEnabled: true,
      feedbackEffectsEnabled: false,
      showExplanations: true,
      defaultSessionLength: 10,
      defaultDifficulty: 2,
      defaultOperations: [],
      masteryThreshold: 3,
    })
    const user = userEvent.setup()
    render(<App />)
    await startFixedSession(user)
    await reportCorrectAnswer(user)

    expect(
      screen
        .getAllByRole('status')
        .every(
          (status) =>
            !feedbackMessages.correctMessages.includes(
              status.textContent ?? '',
            ) &&
            !feedbackMessages.supportiveMessages.includes(
              status.textContent ?? '',
            ),
        ),
    ).toBe(true)
  })

  it('restores an unfinished session and its selected answer after a refresh', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)
    await startFixedSession(user)
    await user.click(screen.getAllByRole('radio')[0])
    const selectedAnswer = screen.getAllByRole('radio')[0].getAttribute('value')

    expect(loadActiveSession()).toMatchObject({
      session: { attemptedCount: 0 },
      selectedAnswer: Number(selectedAnswer),
    })
    unmount()
    window.history.pushState({}, '', '/practice')
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Question 1 of 5' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('radio')[0]).toBeChecked()
  })

  it('keeps or clears an active session based on the navigation confirmation', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const user = userEvent.setup()
    render(<App />)
    await startFixedSession(user)

    await user.click(screen.getByRole('link', { name: 'Statistics' }))
    expect(confirm).toHaveBeenCalledOnce()
    expect(
      screen.getByRole('heading', { name: 'Question 1 of 5' }),
    ).toBeInTheDocument()
    expect(loadActiveSession()).not.toBeNull()

    confirm.mockReturnValue(true)
    await user.click(screen.getByRole('link', { name: 'Home' }))
    expect(
      screen.getByRole('heading', { name: 'Ready to grow your math skills?' }),
    ).toBeInTheDocument()
    expect(loadActiveSession()).toBeNull()
    confirm.mockRestore()
  })

  it('starts a mixed-operation session with every selected operation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Start practice' }))
    await user.click(screen.getByRole('button', { name: 'Clear selection' }))
    await user.click(screen.getByLabelText('Addition'))
    await user.click(screen.getByLabelText('Multiplication'))
    await user.click(screen.getByLabelText('Level 2: Easy'))
    await user.click(screen.getByLabelText('5 questions'))
    await user.click(screen.getByRole('button', { name: 'Start practice' }))

    expect(loadActiveSession()?.setup.operations).toEqual([
      'addition',
      'multiplication',
    ])
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
