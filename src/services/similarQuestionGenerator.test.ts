import { describe, expect, it } from 'vitest'
import type { MistakePattern, Question } from '../types/math'
import {
  generateFactFamilyQuestion,
  generateNearbyNumberQuestion,
  generateReversedOperandQuestion,
  generateSimilarQuestion,
} from './similarQuestionGenerator'

function pattern(
  operation: MistakePattern['operation'],
  firstOperand: number,
  secondOperand: number,
  correctAnswer: number,
): MistakePattern {
  return {
    id: `${operation}-pattern`,
    operation,
    firstOperand,
    secondOperand,
    correctAnswer,
    difficulty: 2,
    lastIncorrectAt: '2026-10-18T10:00:00.000Z',
    incorrectCount: 1,
    similarCorrectCount: 0,
    isMastered: false,
  }
}

function expectCompleteReviewQuestion(question: Question, patternId: string) {
  expect(question.source).toBe('mistake-review')
  expect(question.mistakePatternId).toBe(patternId)
  expect(question.choices).toHaveLength(4)
  expect(new Set(question.choices).size).toBe(4)
  expect(question.choices).toContain(question.correctAnswer)
}

describe('similar question generation', () => {
  it('creates a valid nearby-number question linked to its pattern', () => {
    const source = pattern('division', 24, 4, 6)
    const question = generateNearbyNumberQuestion(source)

    expectCompleteReviewQuestion(question, source.id)
    expect(question.operation).toBe('division')
    expect(question.firstOperand / question.secondOperand).toBe(
      question.correctAnswer,
    )
    expect(question.firstOperand).not.toBe(source.firstOperand)
  })

  it('reverses only addition and multiplication facts', () => {
    const addition = pattern('addition', 3, 9, 12)
    const reversedAddition = generateReversedOperandQuestion(addition)
    expect(reversedAddition).toMatchObject({
      operation: 'addition',
      firstOperand: 9,
      secondOperand: 3,
    })

    const subtraction = pattern('subtraction', 9, 3, 6)
    const subtractionAlternative = generateReversedOperandQuestion(subtraction)
    expect(subtractionAlternative.operation).toBe('subtraction')
    expect(subtractionAlternative).not.toMatchObject({
      firstOperand: 3,
      secondOperand: 9,
    })
  })

  it('uses inverse operations for each fact family', () => {
    expect(
      generateFactFamilyQuestion(pattern('addition', 4, 5, 9)),
    ).toMatchObject({
      operation: 'subtraction',
      firstOperand: 9,
      secondOperand: 4,
      correctAnswer: 5,
    })
    expect(
      generateFactFamilyQuestion(pattern('subtraction', 9, 4, 5)),
    ).toMatchObject({
      operation: 'addition',
      firstOperand: 5,
      secondOperand: 4,
      correctAnswer: 9,
    })
    expect(
      generateFactFamilyQuestion(pattern('multiplication', 4, 5, 20)),
    ).toMatchObject({
      operation: 'division',
      firstOperand: 20,
      secondOperand: 4,
      correctAnswer: 5,
    })
    expect(
      generateFactFamilyQuestion(pattern('division', 20, 4, 5)),
    ).toMatchObject({
      operation: 'multiplication',
      firstOperand: 4,
      secondOperand: 5,
      correctAnswer: 20,
    })
  })

  it('selects a complete review question from the available strategies', () => {
    const source = pattern('multiplication', 3, 4, 12)
    expectCompleteReviewQuestion(generateSimilarQuestion(source), source.id)
  })
})
