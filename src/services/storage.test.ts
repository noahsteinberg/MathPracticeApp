import { beforeEach, describe, expect, it } from 'vitest'
import type { PracticeAttempt, PracticeSession } from '../types/math'
import { DEFAULT_APP_SETTINGS } from '../types/math'
import {
  clearAllApplicationData,
  clearPracticeHistory,
  loadAttempts,
  loadSessions,
  loadSettings,
  saveAttempt,
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

describe('storage service', () => {
  beforeEach(() => window.localStorage.clear())

  it('recovers from malformed saved data with safe defaults', () => {
    window.localStorage.setItem(storageKeys.settings, '{bad json')
    window.localStorage.setItem(storageKeys.attempts, '{bad json')
    expect(loadSettings()).toEqual(DEFAULT_APP_SETTINGS)
    expect(loadAttempts()).toEqual([])
  })

  it('persists settings, attempts, and sessions', () => {
    const settings = {
      ...DEFAULT_APP_SETTINGS,
      cardAnimationsEnabled: false,
      defaultDifficulty: 3 as const,
    }
    expect(saveSettings(settings)).toBe(true)
    expect(saveAttempt(attempt)).toBe(true)
    expect(saveSession(session)).toBe(true)
    expect(loadSettings()).toEqual(settings)
    expect(loadAttempts()).toEqual([attempt])
    expect(loadSessions()).toEqual([session])
  })

  it('clears history without clearing settings, then clears all data', () => {
    saveSettings({ ...DEFAULT_APP_SETTINGS, soundEffectsEnabled: false })
    saveAttempt(attempt)
    saveSession(session)
    expect(clearPracticeHistory()).toBe(true)
    expect(loadAttempts()).toEqual([])
    expect(loadSessions()).toEqual([])
    expect(loadSettings().soundEffectsEnabled).toBe(false)
    expect(clearAllApplicationData()).toBe(true)
    expect(loadSettings()).toEqual(DEFAULT_APP_SETTINGS)
  })
})
