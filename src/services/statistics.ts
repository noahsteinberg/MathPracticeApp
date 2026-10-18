import {
  createEmptyAppStatistics,
  type AppStatistics,
  type OperationStatistics,
  type PracticeAttempt,
} from '../types/math'

export function calculateStatistics(
  attempts: PracticeAttempt[],
): AppStatistics {
  return attempts.reduce((statistics, attempt) => {
    const wasCorrect = attempt.selfReportedCorrect
    const update = (target: OperationStatistics) => {
      target.attempted += 1
      if (wasCorrect) target.correct += 1
      else target.incorrect += 1
    }

    update(statistics)
    update(statistics.byOperation[attempt.operation])
    update(statistics.byDifficulty[attempt.difficulty])
    return statistics
  }, createEmptyAppStatistics())
}

export function accuracy(statistics: OperationStatistics): number {
  return statistics.attempted === 0
    ? 0
    : Math.round((statistics.correct / statistics.attempted) * 100)
}
