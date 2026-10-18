import type {
  AppSettings,
  DifficultyLevel,
  MathOperation,
  MistakePattern,
} from '../types/math'

export function activeMistakePatterns(
  patterns: MistakePattern[],
  operations?: MathOperation[],
  difficulty?: DifficultyLevel,
): MistakePattern[] {
  return patterns.filter(
    (pattern) =>
      !pattern.isMastered &&
      (operations === undefined || operations.includes(pattern.operation)) &&
      (difficulty === undefined || pattern.difficulty === difficulty),
  )
}

export function reviewPriority(
  pattern: MistakePattern,
  masteryThreshold: number,
  now = new Date(),
): number {
  const remainingSuccesses = Math.max(
    0,
    masteryThreshold - pattern.similarCorrectCount,
  )
  const lastIncorrect = Date.parse(pattern.lastIncorrectAt)
  const ageInDays = Number.isNaN(lastIncorrect)
    ? 30
    : Math.max(0, (now.getTime() - lastIncorrect) / 86_400_000)
  const recencyBonus = Math.max(0, 30 - ageInDays)

  return (
    pattern.incorrectCount * 10_000 + remainingSuccesses * 100 + recencyBonus
  )
}

export function selectReviewPattern(
  patterns: MistakePattern[],
  settings: Pick<AppSettings, 'masteryThreshold'>,
  options: {
    operations?: MathOperation[]
    difficulty?: DifficultyLevel
    previousPatternId?: string
    now?: Date
    random?: () => number
  } = {},
): MistakePattern | null {
  const candidates = activeMistakePatterns(
    patterns,
    options.operations,
    options.difficulty,
  )
  const alternatives = candidates.filter(
    (pattern) => pattern.id !== options.previousPatternId,
  )
  const eligible = alternatives.length > 0 ? alternatives : candidates
  if (eligible.length === 0) return null

  const now = options.now ?? new Date()
  const priorities = eligible.map((pattern) => ({
    pattern,
    priority: reviewPriority(pattern, settings.masteryThreshold, now),
  }))
  const highestPriority = Math.max(
    ...priorities.map(({ priority }) => priority),
  )
  const tied = priorities
    .filter(({ priority }) => priority === highestPriority)
    .map(({ pattern }) => pattern)
  return tied[Math.floor((options.random ?? Math.random)() * tied.length)]
}

export function updatePatternAfterReview(
  patterns: MistakePattern[],
  patternId: string,
  selfReportedCorrect: boolean,
  masteryThreshold: number,
  occurredAt = new Date().toISOString(),
): MistakePattern[] {
  return patterns.map((pattern) => {
    if (pattern.id !== patternId) return pattern

    if (!selfReportedCorrect) {
      return {
        ...pattern,
        incorrectCount: pattern.incorrectCount + 1,
        lastIncorrectAt: occurredAt,
        similarCorrectCount: 0,
        isMastered: false,
      }
    }

    const similarCorrectCount = pattern.similarCorrectCount + 1
    return {
      ...pattern,
      similarCorrectCount,
      isMastered: similarCorrectCount >= masteryThreshold,
    }
  })
}
