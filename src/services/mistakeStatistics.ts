import type {
  MathOperation,
  MistakePattern,
  MistakeStatistics,
  PracticeAttempt,
} from '../types/math'

const operations: MathOperation[] = [
  'addition',
  'subtraction',
  'multiplication',
  'division',
]

export function sortMistakePatterns(
  patterns: MistakePattern[],
): MistakePattern[] {
  return [...patterns].sort((left, right) => {
    if (right.incorrectCount !== left.incorrectCount) {
      return right.incorrectCount - left.incorrectCount
    }
    return right.lastIncorrectAt.localeCompare(left.lastIncorrectAt)
  })
}

export function calculateMistakeStatistics(
  patterns: MistakePattern[],
  attempts: PracticeAttempt[],
): MistakeStatistics {
  const sortedPatterns = sortMistakePatterns(patterns)
  const reviewAttempts = attempts.filter(
    (attempt) => attempt.source === 'mistake-review',
  )
  const byOperation = Object.fromEntries(
    operations.map((operation) => [operation, 0]),
  ) as Record<MathOperation, number>
  patterns.forEach((pattern) => {
    byOperation[pattern.operation] += pattern.incorrectCount
  })
  const highestIncorrectCount = Math.max(...Object.values(byOperation))
  const mostMissedOperations =
    highestIncorrectCount === 0
      ? []
      : operations.filter(
          (operation) => byOperation[operation] === highestIncorrectCount,
        )
  const highestPatternCount = sortedPatterns[0]?.incorrectCount ?? 0

  return {
    activeCount: patterns.filter((pattern) => !pattern.isMastered).length,
    masteredCount: patterns.filter((pattern) => pattern.isMastered).length,
    reviewAttempted: reviewAttempts.length,
    reviewCorrect: reviewAttempts.filter(
      (attempt) => attempt.selfReportedCorrect,
    ).length,
    mostMissedOperations,
    mostMissedPatterns: sortedPatterns.filter(
      (pattern) => pattern.incorrectCount === highestPatternCount,
    ),
    sortedPatterns,
  }
}
