import {
  DEFAULT_APP_SETTINGS,
  type ActivePracticeSession,
  type AppSettings,
  type DifficultyLevel,
  type MathOperation,
  type MistakePattern,
  type PracticeAttempt,
  type PracticeSession,
  type SessionLength,
} from '../types/math'

const PREFIX = 'math-practice-app'
const SCHEMA_VERSION = 1
const keys = {
  schemaVersion: `${PREFIX}:schema-version`,
  settings: `${PREFIX}:settings`,
  attempts: `${PREFIX}:attempts`,
  sessions: `${PREFIX}:sessions`,
  mistakePatterns: `${PREFIX}:mistake-patterns`,
  activeSession: `${PREFIX}:active-session`,
} as const

const operations: MathOperation[] = [
  'addition',
  'subtraction',
  'multiplication',
  'division',
]

function storageAvailable(): Storage | null {
  try {
    if (typeof window === 'undefined') return null
    return window.localStorage
  } catch {
    return null
  }
}

function readJson<T>(key: string): T | null {
  const storage = storageAvailable()
  if (!storage) return null
  try {
    const raw = storage.getItem(key)
    return raw === null ? null : (JSON.parse(raw) as T)
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown): boolean {
  const storage = storageAvailable()
  if (!storage) return false
  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function remove(key: string): boolean {
  const storage = storageAvailable()
  if (!storage) return false
  try {
    storage.removeItem(key)
    return true
  } catch {
    return false
  }
}

function isDifficulty(value: unknown): value is DifficultyLevel {
  return value === 1 || value === 2 || value === 3 || value === 4
}

function isSessionLength(value: unknown): value is SessionLength {
  return value === 5 || value === 10 || value === 20 || value === 'continuous'
}

function isOperation(value: unknown): value is MathOperation {
  return (
    typeof value === 'string' && operations.includes(value as MathOperation)
  )
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isAttempt(value: unknown): value is PracticeAttempt {
  if (!isObject(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.questionId === 'string' &&
    isOperation(value.operation) &&
    typeof value.firstOperand === 'number' &&
    typeof value.secondOperand === 'number' &&
    typeof value.correctAnswer === 'number' &&
    typeof value.selectedAnswer === 'number' &&
    typeof value.selfReportedCorrect === 'boolean' &&
    isDifficulty(value.difficulty) &&
    (value.source === 'regular' || value.source === 'mistake-review') &&
    typeof value.attemptedAt === 'string' &&
    typeof value.sessionId === 'string'
  )
}

function isSession(value: unknown): value is PracticeSession {
  if (!isObject(value) || !Array.isArray(value.operations)) return false
  return (
    typeof value.id === 'string' &&
    value.operations.every(isOperation) &&
    isDifficulty(value.difficulty) &&
    isSessionLength(value.sessionLength) &&
    typeof value.startedAt === 'string' &&
    (value.completedAt === undefined ||
      typeof value.completedAt === 'string') &&
    typeof value.attemptedCount === 'number' &&
    typeof value.correctCount === 'number' &&
    typeof value.incorrectCount === 'number' &&
    typeof value.mistakeReviewCount === 'number'
  )
}

function isQuestion(
  value: unknown,
): value is ActivePracticeSession['question'] {
  if (!isObject(value) || !Array.isArray(value.choices)) return false
  return (
    typeof value.id === 'string' &&
    isOperation(value.operation) &&
    typeof value.firstOperand === 'number' &&
    typeof value.secondOperand === 'number' &&
    typeof value.displayText === 'string' &&
    typeof value.correctAnswer === 'number' &&
    value.choices.length === 4 &&
    value.choices.every((choice) => typeof choice === 'number') &&
    isDifficulty(value.difficulty) &&
    (value.source === 'regular' || value.source === 'mistake-review') &&
    (value.mistakePatternId === undefined ||
      typeof value.mistakePatternId === 'string')
  )
}

function isPracticeSetup(
  value: unknown,
): value is ActivePracticeSession['setup'] {
  if (!isObject(value) || !Array.isArray(value.operations)) return false
  return (
    value.operations.length > 0 &&
    value.operations.every(isOperation) &&
    isDifficulty(value.difficulty) &&
    isSessionLength(value.sessionLength) &&
    (value.reviewMode === 'regular' || value.reviewMode === 'mistake-review')
  )
}

function isActivePracticeSession(
  value: unknown,
): value is ActivePracticeSession {
  if (!isObject(value)) return false
  return (
    isPracticeSetup(value.setup) &&
    isSession(value.session) &&
    value.session.completedAt === undefined &&
    isQuestion(value.question) &&
    (value.selectedAnswer === null ||
      typeof value.selectedAnswer === 'number') &&
    value.session.operations.join() === value.setup.operations.join() &&
    value.session.difficulty === value.setup.difficulty &&
    value.session.sessionLength === value.setup.sessionLength
  )
}

function isMistakePattern(value: unknown): value is MistakePattern {
  if (!isObject(value)) return false
  return (
    typeof value.id === 'string' &&
    isOperation(value.operation) &&
    typeof value.firstOperand === 'number' &&
    typeof value.secondOperand === 'number' &&
    typeof value.correctAnswer === 'number' &&
    isDifficulty(value.difficulty) &&
    typeof value.lastIncorrectAt === 'string' &&
    typeof value.incorrectCount === 'number' &&
    typeof value.similarCorrectCount === 'number' &&
    typeof value.isMastered === 'boolean'
  )
}

export function initializeStorage(): void {
  const storedVersion = readJson<number>(keys.schemaVersion)
  if (storedVersion !== SCHEMA_VERSION) {
    // Reserved migration point: only this app's keys may change in future versions.
    writeJson(keys.schemaVersion, SCHEMA_VERSION)
  }
}

export function loadSettings(): AppSettings {
  initializeStorage()
  const saved = readJson<Partial<AppSettings>>(keys.settings)
  if (!isObject(saved)) return { ...DEFAULT_APP_SETTINGS }

  return {
    soundEffectsEnabled:
      typeof saved.soundEffectsEnabled === 'boolean'
        ? saved.soundEffectsEnabled
        : DEFAULT_APP_SETTINGS.soundEffectsEnabled,
    cardAnimationsEnabled:
      typeof saved.cardAnimationsEnabled === 'boolean'
        ? saved.cardAnimationsEnabled
        : DEFAULT_APP_SETTINGS.cardAnimationsEnabled,
    feedbackEffectsEnabled:
      typeof saved.feedbackEffectsEnabled === 'boolean'
        ? saved.feedbackEffectsEnabled
        : DEFAULT_APP_SETTINGS.feedbackEffectsEnabled,
    showExplanations:
      typeof saved.showExplanations === 'boolean'
        ? saved.showExplanations
        : DEFAULT_APP_SETTINGS.showExplanations,
    defaultSessionLength: isSessionLength(saved.defaultSessionLength)
      ? saved.defaultSessionLength
      : DEFAULT_APP_SETTINGS.defaultSessionLength,
    defaultDifficulty: isDifficulty(saved.defaultDifficulty)
      ? saved.defaultDifficulty
      : DEFAULT_APP_SETTINGS.defaultDifficulty,
    defaultOperations:
      Array.isArray(saved.defaultOperations) &&
      saved.defaultOperations.length > 0 &&
      saved.defaultOperations.every(isOperation)
        ? saved.defaultOperations
        : [...DEFAULT_APP_SETTINGS.defaultOperations],
    masteryThreshold:
      typeof saved.masteryThreshold === 'number' && saved.masteryThreshold > 0
        ? saved.masteryThreshold
        : DEFAULT_APP_SETTINGS.masteryThreshold,
  }
}

export function saveSettings(settings: AppSettings): boolean {
  initializeStorage()
  return writeJson(keys.settings, settings)
}

export function loadAttempts(): PracticeAttempt[] {
  initializeStorage()
  const saved = readJson<unknown[]>(keys.attempts)
  return Array.isArray(saved) ? saved.filter(isAttempt) : []
}

export function saveAttempt(attempt: PracticeAttempt): boolean {
  return writeJson(keys.attempts, [...loadAttempts(), attempt])
}

export function loadSessions(): PracticeSession[] {
  initializeStorage()
  const saved = readJson<unknown[]>(keys.sessions)
  return Array.isArray(saved) ? saved.filter(isSession) : []
}

export function saveSession(session: PracticeSession): boolean {
  const sessions = loadSessions()
  const index = sessions.findIndex(({ id }) => id === session.id)
  if (index >= 0) sessions[index] = session
  else sessions.push(session)
  return writeJson(keys.sessions, sessions)
}

export function loadActiveSession(): ActivePracticeSession | null {
  initializeStorage()
  const saved = readJson<unknown>(keys.activeSession)
  return isActivePracticeSession(saved) ? saved : null
}

export function saveActiveSession(
  activeSession: ActivePracticeSession,
): boolean {
  initializeStorage()
  return writeJson(keys.activeSession, activeSession)
}

export function clearActiveSession(): boolean {
  return remove(keys.activeSession)
}

export function loadMistakePatterns(): MistakePattern[] {
  initializeStorage()
  const saved = readJson<unknown[]>(keys.mistakePatterns)
  return Array.isArray(saved) ? saved.filter(isMistakePattern) : []
}

export function saveMistakePatterns(patterns: MistakePattern[]): boolean {
  initializeStorage()
  return writeJson(keys.mistakePatterns, patterns)
}

export function clearPracticeHistory(): boolean {
  return (
    remove(keys.attempts) && remove(keys.sessions) && remove(keys.activeSession)
  )
}

export function clearAllApplicationData(): boolean {
  return [
    keys.schemaVersion,
    keys.settings,
    keys.attempts,
    keys.sessions,
    keys.mistakePatterns,
    keys.activeSession,
  ].every(remove)
}

export const storageKeys = keys
