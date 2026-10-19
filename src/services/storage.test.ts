import { beforeEach, describe, expect, it } from 'vitest'
import type {
  ActivePracticeSession,
  MistakePattern,
  PracticeAttempt,
  PracticeSession,
} from '../types/math'
import { DEFAULT_APP_SETTINGS } from '../types/math'
import {
  clearAllApplicationData,
  clearActiveSession,
  clearPracticeHistory,
  loadActiveSession,
  loadAttempts,
  loadMistakePatterns,
  loadSessions,
  loadSettings,
  saveAttempt,
  saveActiveSession,
  saveMistakePatterns,
  saveSession,
  saveSettings,
  storageKeys,
} from './storage'

const attempt: PracticeAttempt = {
  id: 'attempt',
  questionId: 'question',
  operation: 'addition',
  firstOperand: 2,
  secondOperand: 3,
  correctAnswer: 5,
  selectedAnswer: 5,
  selfReportedCorrect: true,
  difficulty: 1,
  source: 'regular',
  attemptedAt: '2026-01-01T00:00:00.000Z',
  sessionId: 'session',
}
const session: PracticeSession = {
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
}
const mistakePattern: MistakePattern = {
  id: 'addition:2:3:difficulty-1',
  operation: 'addition',
  firstOperand: 2,
  secondOperand: 3,
  correctAnswer: 5,
  difficulty: 1,
  lastIncorrectAt: '2026-01-01T00:00:00.000Z',
  incorrectCount: 1,
  similarCorrectCount: 0,
  isMastered: false,
}

const activeSession: ActivePracticeSession = {
  setup: {
    operations: ['addition'],
    difficulty: 1,
    sessionLength: 5,
    reviewMode: 'regular',
  },
  session: { ...session, completedAt: undefined },
  question: {
    id: 'active-question',
    operation: 'addition',
    firstOperand: 2,
    secondOperand: 3,
    displayText: '2 + 3 = ?',
    correctAnswer: 5,
    choices: [3, 4, 5, 6],
    difficulty: 1,
    source: 'regular',
  },
  selectedAnswer: 5,
}

describe('storage service', () => {
  beforeEach(() => window.localStorage.clear())

  it('recovers from malformed saved data with safe defaults', () => {
    window.localStorage.setItem(storageKeys.settings, '{bad json')
    window.localStorage.setItem(storageKeys.attempts, '{bad json')
    expect(loadSettings()).toEqual(DEFAULT_APP_SETTINGS)
    expect(loadAttempts()).toEqual([])
    expect(window.localStorage.getItem(storageKeys.settings)).toBeNull()
    expect(window.localStorage.getItem(storageKeys.attempts)).toBeNull()
  })

  it('resets only malformed record categories while preserving valid data', () => {
    saveAttempt(attempt)
    window.localStorage.setItem(
      storageKeys.sessions,
      JSON.stringify([{ id: 1 }]),
    )
    window.localStorage.setItem(
      storageKeys.mistakePatterns,
      JSON.stringify([{ id: 'invalid' }]),
    )

    expect(loadAttempts()).toEqual([attempt])
    expect(loadSessions()).toEqual([])
    expect(loadMistakePatterns()).toEqual([])
    expect(window.localStorage.getItem(storageKeys.sessions)).toBe('[]')
    expect(window.localStorage.getItem(storageKeys.mistakePatterns)).toBe('[]')
  })

  it('persists settings, attempts, sessions, and mistake patterns', () => {
    const settings = {
      ...DEFAULT_APP_SETTINGS,
      cardAnimationsEnabled: false,
      defaultDifficulty: 3 as const,
    }
    expect(saveSettings(settings)).toBe(true)
    expect(saveAttempt(attempt)).toBe(true)
    expect(saveSession(session)).toBe(true)
    expect(saveMistakePatterns([mistakePattern])).toBe(true)
    expect(loadSettings()).toEqual(settings)
    expect(loadAttempts()).toEqual([attempt])
    expect(loadSessions()).toEqual([session])
    expect(loadMistakePatterns()).toEqual([mistakePattern])
  })

  it('persists and clears a validated unfinished session', () => {
    expect(saveActiveSession(activeSession)).toBe(true)
    expect(loadActiveSession()).toEqual(activeSession)
    expect(clearActiveSession()).toBe(true)
    expect(loadActiveSession()).toBeNull()

    window.localStorage.setItem(
      storageKeys.activeSession,
      JSON.stringify({ ...activeSession, selectedAnswer: 'not a number' }),
    )
    expect(loadActiveSession()).toBeNull()
  })

  it('clears history without clearing settings, then clears all data', () => {
    saveSettings({ ...DEFAULT_APP_SETTINGS, soundEffectsEnabled: false })
    saveAttempt(attempt)
    saveSession(session)
    saveMistakePatterns([mistakePattern])
    expect(clearPracticeHistory()).toBe(true)
    expect(loadAttempts()).toEqual([])
    expect(loadSessions()).toEqual([])
    expect(loadSettings().soundEffectsEnabled).toBe(false)
    expect(clearAllApplicationData()).toBe(true)
    expect(loadSettings()).toEqual(DEFAULT_APP_SETTINGS)
    expect(loadMistakePatterns()).toEqual([])
  })
})
