import { describe, expect, it } from 'vitest'
import type { PracticeAttempt } from '../types/math'
import { accuracy, calculateStatistics } from './statistics'

const attempts: PracticeAttempt[] = [
  {
    id: '1',
    questionId: 'q1',
    operation: 'addition',
    firstOperand: 1,
    secondOperand: 2,
    correctAnswer: 3,
    selectedAnswer: 3,
    selfReportedCorrect: true,
    difficulty: 1,
    source: 'regular',
    attemptedAt: '2026-01-01T00:00:00.000Z',
    sessionId: 's1',
  },
  {
    id: '2',
    questionId: 'q2',
    operation: 'division',
    firstOperand: 12,
    secondOperand: 3,
    correctAnswer: 4,
    selectedAnswer: 3,
    selfReportedCorrect: false,
    difficulty: 2,
    source: 'regular',
    attemptedAt: '2026-01-02T00:00:00.000Z',
    sessionId: 's2',
  },
]

describe('statistics calculations', () => {
  it('calculates totals by operation and difficulty', () => {
    const statistics = calculateStatistics(attempts)
    expect(statistics).toMatchObject({ attempted: 2, correct: 1, incorrect: 1 })
    expect(statistics.byOperation.addition).toMatchObject({
      attempted: 1,
      correct: 1,
    })
    expect(statistics.byOperation.division).toMatchObject({
      attempted: 1,
      incorrect: 1,
    })
    expect(statistics.byDifficulty[1].attempted).toBe(1)
    expect(statistics.byDifficulty[2].incorrect).toBe(1)
  })

  it('handles zero attempts safely', () => {
    expect(accuracy({ attempted: 0, correct: 0, incorrect: 0 })).toBe(0)
  })
})
