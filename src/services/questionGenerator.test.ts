import { describe, expect, it, vi } from 'vitest'
import type { Question } from '../types/math'
import {
  createQuestion,
  createSessionQuestion,
  generateQuestion,
  isValidQuestion,
} from './questionGenerator'

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

  it('retries invalid generated questions and uses a valid fallback', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const invalidQuestion = {
      ...createQuestion('addition', 1),
      choices: [1, 1, 1, 1],
    } satisfies Question
    const createInvalidQuestion = vi.fn(() => invalidQuestion)

    const question = createSessionQuestion(
      ['addition'],
      1,
      undefined,
      createInvalidQuestion,
    )

    expect(createInvalidQuestion).toHaveBeenCalledTimes(12)
    expect(isValidQuestion(question)).toBe(true)
    expect(question.operation).toBe('addition')
    expect(error).toHaveBeenCalled()
    error.mockRestore()
  })
})
