import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import {
  loadAttempts,
  loadSettings,
  saveAttempt,
  saveMistakePatterns,
  saveSession,
} from '../services/storage'

describe('settings and statistics pages', () => {
  beforeEach(() => window.history.pushState({}, '', '/'))

  it('saves settings and clears all application data after confirmation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Settings' }))
    await user.click(
      await screen.findByRole('checkbox', { name: 'Card animations' }),
    )
    await user.click(
      screen.getByRole('checkbox', { name: 'Feedback messages' }),
    )
    await user.selectOptions(screen.getByLabelText('Default difficulty'), '4')
    expect(loadSettings()).toMatchObject({
      cardAnimationsEnabled: false,
      feedbackEffectsEnabled: false,
      defaultDifficulty: 4,
    })

    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    await user.click(
      screen.getByRole('button', { name: 'Clear all application data' }),
    )
    expect(confirm).toHaveBeenCalledOnce()
    expect(
      screen.getByRole('heading', { name: 'Ready to grow your math skills?' }),
    ).toBeInTheDocument()
    expect(loadSettings().defaultDifficulty).toBe(2)
    confirm.mockRestore()
  })

  it('shows persisted statistics and resets only practice history', async () => {
    saveAttempt({
      id: 'attempt',
      questionId: 'question',
      operation: 'addition',
      firstOperand: 1,
      secondOperand: 2,
      correctAnswer: 3,
      selectedAnswer: 3,
      selfReportedCorrect: true,
      difficulty: 1,
      source: 'regular',
      attemptedAt: '2026-01-01T00:00:00.000Z',
      sessionId: 'session',
    })
    saveSession({
      id: 'session',
      operations: ['addition'],
      difficulty: 1,
      sessionLength: 5,
      startedAt: '2026-01-01T00:00:00.000Z',
      completedAt: '2026-01-01T00:01:00.000Z',
      attemptedCount: 1,
      correctCount: 1,
      incorrectCount: 0,
      mistakeReviewCount: 0,
    })
    window.history.pushState({}, '', '/statistics')
    const user = userEvent.setup()
    render(<App />)

    expect(
      await screen.findByRole('heading', { name: 'Statistics' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Overall')).toBeInTheDocument()
    expect(screen.getByText('Overall').parentElement).toHaveTextContent(
      '1 attempted',
    )
    expect(screen.getByText('Recent sessions')).toBeInTheDocument()

    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    await user.click(screen.getByRole('button', { name: 'Reset statistics' }))
    expect(loadAttempts()).toEqual([])
    expect(screen.getByText(/No questions yet/)).toBeInTheDocument()
    confirm.mockRestore()
  })

  it('shows active, mastered, and detailed mistake insights', async () => {
    saveMistakePatterns([
      {
        id: 'addition:2:3:difficulty-1',
        operation: 'addition',
        firstOperand: 2,
        secondOperand: 3,
        correctAnswer: 5,
        difficulty: 1,
        lastIncorrectAt: '2026-10-18T10:00:00.000Z',
        incorrectCount: 2,
        similarCorrectCount: 1,
        isMastered: false,
      },
      {
        id: 'division:12:3:difficulty-1',
        operation: 'division',
        firstOperand: 12,
        secondOperand: 3,
        correctAnswer: 4,
        difficulty: 1,
        lastIncorrectAt: '2026-10-17T10:00:00.000Z',
        incorrectCount: 1,
        similarCorrectCount: 3,
        isMastered: true,
      },
    ])
    window.history.pushState({}, '', '/statistics')
    render(<App />)

    expect(
      await screen.findByRole('heading', { name: 'Mistake review insights' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Active mistakes').parentElement).toHaveTextContent(
      '1 attempted',
    )
    expect(
      screen.getAllByText('Mastered patterns')[0].parentElement,
    ).toHaveTextContent('1 attempted')
    expect(screen.getByText('Most missed facts')).toBeInTheDocument()
    expect(screen.getAllByText('Mastered patterns')).toHaveLength(2)
    expect(screen.getAllByText(/2 \+ 3/)).toHaveLength(2)
  })
})
