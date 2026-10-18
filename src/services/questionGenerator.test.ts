import { describe, expect, it } from 'vitest'
import { createQuestion, generateQuestion } from './questionGenerator'

describe('question generation', () => {
  it('creates valid questions for every operation and difficulty', () => {
    const operations = [
      'addition',
      'subtraction',
      'multiplication',
      'division',
    ] as const

    for (const operation of operations) {
      for (const difficulty of [1, 2, 3, 4] as const) {
        for (let attempt = 0; attempt < 40; attempt += 1) {
          const question = generateQuestion(operation, difficulty)
          expect(question.correctAnswer).toBe(
            operation === 'addition'
              ? question.firstOperand + question.secondOperand
              : operation === 'subtraction'
                ? question.firstOperand - question.secondOperand
                : operation === 'multiplication'
                  ? question.firstOperand * question.secondOperand
                  : question.firstOperand / question.secondOperand,
          )
          expect(question.displayText).toContain('= ?')
          if (operation === 'subtraction')
            expect(question.correctAnswer).toBeGreaterThanOrEqual(0)
          if (operation === 'division') {
            expect(question.secondOperand).toBeGreaterThan(0)
            expect(Number.isInteger(question.correctAnswer)).toBe(true)
          }
        }
      }
    }
  })

  it('uses the documented beginner and intermediate bounds', () => {
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const beginner = generateQuestion('multiplication', 1)
      expect(beginner.firstOperand).toBeLessThanOrEqual(5)
      expect(beginner.secondOperand).toBeLessThanOrEqual(5)

      const division = generateQuestion('division', 3)
      expect(division.secondOperand).toBeLessThanOrEqual(12)
      expect(division.firstOperand).toBeLessThanOrEqual(144)
    }
  })

  it('adds exactly four unique choices including the correct answer', () => {
    const question = createQuestion('multiplication', 2)
    expect(question.choices).toHaveLength(4)
    expect(new Set(question.choices).size).toBe(4)
    expect(question.choices).toContain(question.correctAnswer)
  })
})
