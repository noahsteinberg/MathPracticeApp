import { describe, expect, it } from 'vitest'
import type { MistakePattern } from '../types/math'
import {
  activeMistakePatterns,
  reviewPriority,
  selectReviewPattern,
  updatePatternAfterReview,
} from './mistakeReview'

function pattern(overrides: Partial<MistakePattern> = {}): MistakePattern {
  return {
    id: 'pattern',
    operation: 'addition',
    firstOperand: 4,
    secondOperand: 5,
    correctAnswer: 9,
    difficulty: 2,
    lastIncorrectAt: '2026-10-18T10:00:00.000Z',
    incorrectCount: 1,
    similarCorrectCount: 0,
    isMastered: false,
    ...overrides,
  }
}

describe('mistake review', () => {
  const settings = { masteryThreshold: 3 }
  const now = new Date('2026-10-18T12:00:00.000Z')

  it('prioritizes frequent, recent mistakes with little review success', () => {
    expect(
      reviewPriority(pattern({ incorrectCount: 3 }), 3, now),
    ).toBeGreaterThan(reviewPriority(pattern({ incorrectCount: 1 }), 3, now))
    expect(
      reviewPriority(
        pattern({ lastIncorrectAt: '2026-10-18T11:00:00.000Z' }),
        3,
        now,
      ),
    ).toBeGreaterThan(
      reviewPriority(
        pattern({ lastIncorrectAt: '2026-09-01T10:00:00.000Z' }),
        3,
        now,
      ),
    )
    expect(
      reviewPriority(pattern({ similarCorrectCount: 0 }), 3, now),
    ).toBeGreaterThan(
      reviewPriority(pattern({ similarCorrectCount: 2 }), 3, now),
    )
  })

  it('randomizes exact priority ties and avoids the previous pattern when possible', () => {
    const first = pattern({ id: 'first' })
    const second = pattern({ id: 'second' })
    expect(
      selectReviewPattern([first, second], settings, {
        now,
        random: () => 0.9,
      })?.id,
    ).toBe('second')
    expect(
      selectReviewPattern([first, second], settings, {
        now,
        previousPatternId: 'first',
      })?.id,
    ).toBe('second')
  })

  it('records correct review answers, mastery, and a later incorrect reset', () => {
    const firstSuccess = updatePatternAfterReview(
      [pattern({ similarCorrectCount: 1 })],
      'pattern',
      true,
      3,
    )
    expect(firstSuccess[0]).toMatchObject({
      similarCorrectCount: 2,
      isMastered: false,
    })

    const mastered = updatePatternAfterReview(firstSuccess, 'pattern', true, 3)
    expect(mastered[0].isMastered).toBe(true)
    expect(activeMistakePatterns(mastered)).toEqual([])

    const reopened = updatePatternAfterReview(
      mastered,
      'pattern',
      false,
      3,
      '2026-10-18T12:00:00.000Z',
    )
    expect(reopened[0]).toMatchObject({
      incorrectCount: 2,
      similarCorrectCount: 0,
      isMastered: false,
      lastIncorrectAt: '2026-10-18T12:00:00.000Z',
    })
  })
})
