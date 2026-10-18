import { beforeEach, describe, expect, it } from 'vitest'
import type { Question } from '../types/math'
import { loadMistakePatterns } from './storage'
import {
  mistakePatternId,
  recordIncorrectQuestion,
  upsertMistakePattern,
} from './mistakePatterns'

const additionQuestion: Question = {
  id: 'addition-question',
  operation: 'addition',
  firstOperand: 8,
  secondOperand: 7,
  displayText: '8 + 7 = ?',
  correctAnswer: 15,
  choices: [15, 14, 16, 13],
  difficulty: 2,
  source: 'regular',
}

describe('mistake patterns', () => {
  beforeEach(() => window.localStorage.clear())

  it('canonicalizes addition and multiplication facts but preserves ordered facts', () => {
    expect(mistakePatternId(additionQuestion)).toBe('addition:7:8:difficulty-2')
    expect(
      mistakePatternId({
        ...additionQuestion,
        operation: 'subtraction',
        firstOperand: 8,
        secondOperand: 7,
        correctAnswer: 1,
      }),
    ).toBe('subtraction:8:7:difficulty-2')
  })

  it('updates an existing pattern instead of duplicating a commutative fact', () => {
    const existing = upsertMistakePattern(
      [],
      additionQuestion,
      '2026-10-18T10:00:00.000Z',
    )
    const updated = upsertMistakePattern(
      [{ ...existing[0], similarCorrectCount: 2, isMastered: true }],
      {
        ...additionQuestion,
        id: 'reversed-addition-question',
        firstOperand: 7,
        secondOperand: 8,
      },
      '2026-10-18T10:01:00.000Z',
    )

    expect(updated).toHaveLength(1)
    expect(updated[0]).toMatchObject({
      incorrectCount: 2,
      similarCorrectCount: 0,
      isMastered: false,
      lastIncorrectAt: '2026-10-18T10:01:00.000Z',
    })
  })

  it('persists newly recorded incorrect questions', () => {
    expect(recordIncorrectQuestion(additionQuestion)).toBe(true)
    expect(loadMistakePatterns()).toEqual([
      expect.objectContaining({
        id: 'addition:7:8:difficulty-2',
        incorrectCount: 1,
        isMastered: false,
      }),
    ])
  })
})
