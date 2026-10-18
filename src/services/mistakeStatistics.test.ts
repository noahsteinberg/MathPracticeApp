import { describe, expect, it } from 'vitest'
import type { MistakePattern, PracticeAttempt } from '../types/math'
import { calculateMistakeStatistics } from './mistakeStatistics'

const patterns: MistakePattern[] = [
  {
    id: 'addition',
    operation: 'addition',
    firstOperand: 3,
    secondOperand: 4,
    correctAnswer: 7,
    difficulty: 1,
    lastIncorrectAt: '2026-10-18T10:00:00.000Z',
    incorrectCount: 3,
    similarCorrectCount: 1,
    isMastered: false,
  },
  {
    id: 'division',
    operation: 'division',
    firstOperand: 12,
    secondOperand: 3,
    correctAnswer: 4,
    difficulty: 1,
    lastIncorrectAt: '2026-10-17T10:00:00.000Z',
    incorrectCount: 3,
    similarCorrectCount: 3,
    isMastered: true,
  },
]

const reviewAttempt: PracticeAttempt = {
  id: 'review-attempt',
  questionId: 'review-question',
  operation: 'addition',
  firstOperand: 4,
  secondOperand: 4,
  correctAnswer: 8,
  selectedAnswer: 8,
  selfReportedCorrect: true,
  difficulty: 1,
  source: 'mistake-review',
  attemptedAt: '2026-10-18T11:00:00.000Z',
  sessionId: 'session',
  mistakePatternId: 'addition',
}

describe('mistake statistics', () => {
  it('counts review outcomes and preserves ties for most missed areas', () => {
    const statistics = calculateMistakeStatistics(patterns, [reviewAttempt])
    expect(statistics).toMatchObject({
      activeCount: 1,
      masteredCount: 1,
      reviewAttempted: 1,
      reviewCorrect: 1,
      mostMissedOperations: ['addition', 'division'],
    })
    expect(statistics.mostMissedPatterns.map(({ id }) => id)).toEqual([
      'addition',
      'division',
    ])
    expect(statistics.sortedPatterns.map(({ id }) => id)).toEqual([
      'addition',
      'division',
    ])
  })

  it('uses empty values safely when no mistakes exist', () => {
    expect(calculateMistakeStatistics([], [])).toMatchObject({
      activeCount: 0,
      masteredCount: 0,
      reviewAttempted: 0,
      reviewCorrect: 0,
      mostMissedOperations: [],
      mostMissedPatterns: [],
    })
  })
})
