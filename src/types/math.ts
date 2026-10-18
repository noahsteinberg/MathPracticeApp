/** The four arithmetic operations supported by the application. */
export type MathOperation =
  'addition' | 'subtraction' | 'multiplication' | 'division'

/** A single selected difficulty level for a practice session. */
export type DifficultyLevel = 1 | 2 | 3 | 4

export type QuestionSource = 'regular' | 'mistake-review'
export type SessionLength = 5 | 10 | 20 | 'continuous'
export type ReviewMode = 'regular' | 'mistake-review'

export interface PracticeSetupConfig {
  operations: MathOperation[]
  difficulty: DifficultyLevel
  sessionLength: SessionLength
}

export interface Question {
  id: string
  operation: MathOperation
  firstOperand: number
  secondOperand: number
  displayText: string
  correctAnswer: number
  choices: number[]
  difficulty: DifficultyLevel
  source: QuestionSource
  mistakePatternId?: string
}

export interface PracticeAttempt {
  id: string
  questionId: string
  operation: MathOperation
  firstOperand: number
  secondOperand: number
  correctAnswer: number
  selectedAnswer: number
  selfReportedCorrect: boolean
  difficulty: DifficultyLevel
  source: QuestionSource
  attemptedAt: string
  sessionId: string
  mistakePatternId?: string
}

export interface PracticeSession {
  id: string
  operations: MathOperation[]
  difficulty: DifficultyLevel
  sessionLength: SessionLength
  startedAt: string
  completedAt?: string
  attemptedCount: number
  correctCount: number
  incorrectCount: number
  mistakeReviewCount: number
}

export interface SessionSummaryData {
  session: PracticeSession
  setup: PracticeSetupConfig
}

export interface MistakePattern {
  id: string
  operation: MathOperation
  firstOperand: number
  secondOperand: number
  correctAnswer: number
  difficulty: DifficultyLevel
  lastIncorrectAt: string
  incorrectCount: number
  similarCorrectCount: number
  isMastered: boolean
}

export interface AppSettings {
  soundEffectsEnabled: boolean
  cardAnimationsEnabled: boolean
  showExplanations: boolean
  defaultSessionLength: SessionLength
  defaultDifficulty: DifficultyLevel
  defaultOperations: MathOperation[]
  masteryThreshold: number
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  soundEffectsEnabled: true,
  cardAnimationsEnabled: true,
  showExplanations: true,
  defaultSessionLength: 10,
  defaultDifficulty: 2,
  defaultOperations: ['addition', 'subtraction', 'multiplication', 'division'],
  masteryThreshold: 3,
}

export interface OperationStatistics {
  attempted: number
  correct: number
  incorrect: number
}

export interface AppStatistics extends OperationStatistics {
  byOperation: Record<MathOperation, OperationStatistics>
  byDifficulty: Record<DifficultyLevel, OperationStatistics>
}

export function createEmptyOperationStatistics(): OperationStatistics {
  return { attempted: 0, correct: 0, incorrect: 0 }
}

export function createEmptyAppStatistics(): AppStatistics {
  return {
    ...createEmptyOperationStatistics(),
    byOperation: {
      addition: createEmptyOperationStatistics(),
      subtraction: createEmptyOperationStatistics(),
      multiplication: createEmptyOperationStatistics(),
      division: createEmptyOperationStatistics(),
    },
    byDifficulty: {
      1: createEmptyOperationStatistics(),
      2: createEmptyOperationStatistics(),
      3: createEmptyOperationStatistics(),
      4: createEmptyOperationStatistics(),
    },
  }
}
