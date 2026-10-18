import type {
  DifficultyLevel,
  MathOperation,
  MistakePattern,
  Question,
} from '../types/math'
import { operationSymbol } from '../utils/math'
import { addAnswerChoices } from './answerChoices'

function calculateAnswer(
  operation: MathOperation,
  firstOperand: number,
  secondOperand: number,
): number {
  switch (operation) {
    case 'addition':
      return firstOperand + secondOperand
    case 'subtraction':
      return firstOperand - secondOperand
    case 'multiplication':
      return firstOperand * secondOperand
    case 'division':
      return firstOperand / secondOperand
  }
}

function createSimilarQuestion(
  pattern: MistakePattern,
  operation: MathOperation,
  firstOperand: number,
  secondOperand: number,
): Question {
  const correctAnswer = calculateAnswer(operation, firstOperand, secondOperand)
  return addAnswerChoices({
    id: crypto.randomUUID(),
    operation,
    firstOperand,
    secondOperand,
    displayText: `${firstOperand} ${operationSymbol(operation)} ${secondOperand} = ?`,
    correctAnswer,
    choices: [],
    difficulty: pattern.difficulty,
    source: 'mistake-review',
    mistakePatternId: pattern.id,
  })
}

function changeWithin(value: number, minimum: number, maximum: number): number {
  if (value < maximum) return value + 1
  if (value > minimum) return value - 1
  return value
}

function multiplicationSecondMaximum(difficulty: DifficultyLevel): number {
  return difficulty === 1 ? 5 : difficulty === 2 ? 10 : 99
}

function divisionMaximumQuotient(difficulty: DifficultyLevel): number {
  return difficulty === 4 ? 40 : difficulty === 3 ? 12 : 10
}

/** Generates a question with one nearby operand while keeping valid arithmetic. */
export function generateNearbyNumberQuestion(
  pattern: MistakePattern,
): Question {
  const { operation, firstOperand, secondOperand, difficulty } = pattern

  switch (operation) {
    case 'addition': {
      const maximum = [10, 50, 100, 1000][difficulty - 1]
      return createSimilarQuestion(
        pattern,
        operation,
        changeWithin(firstOperand, 0, maximum),
        secondOperand,
      )
    }
    case 'subtraction': {
      const maximum = [10, 50, 100, 1000][difficulty - 1]
      if (firstOperand < maximum) {
        return createSimilarQuestion(
          pattern,
          operation,
          firstOperand + 1,
          secondOperand,
        )
      }
      return createSimilarQuestion(
        pattern,
        operation,
        firstOperand,
        changeWithin(secondOperand, 0, firstOperand),
      )
    }
    case 'multiplication':
      return createSimilarQuestion(
        pattern,
        operation,
        firstOperand,
        changeWithin(secondOperand, 0, multiplicationSecondMaximum(difficulty)),
      )
    case 'division': {
      const quotient = changeWithin(
        pattern.correctAnswer,
        0,
        divisionMaximumQuotient(difficulty),
      )
      return createSimilarQuestion(
        pattern,
        operation,
        secondOperand * quotient,
        secondOperand,
      )
    }
  }
}

/** Reversing only changes commutative addition and multiplication facts. */
export function generateReversedOperandQuestion(
  pattern: MistakePattern,
): Question {
  if (
    (pattern.operation === 'addition' ||
      pattern.operation === 'multiplication') &&
    pattern.firstOperand !== pattern.secondOperand
  ) {
    return createSimilarQuestion(
      pattern,
      pattern.operation,
      pattern.secondOperand,
      pattern.firstOperand,
    )
  }

  return generateNearbyNumberQuestion(pattern)
}

/** Uses the inverse operation from the same addition/subtraction or multiplication/division family. */
export function generateFactFamilyQuestion(pattern: MistakePattern): Question {
  switch (pattern.operation) {
    case 'addition':
      return createSimilarQuestion(
        pattern,
        'subtraction',
        pattern.correctAnswer,
        pattern.firstOperand,
      )
    case 'subtraction':
      return createSimilarQuestion(
        pattern,
        'addition',
        pattern.correctAnswer,
        pattern.secondOperand,
      )
    case 'multiplication':
      if (pattern.firstOperand !== 0) {
        return createSimilarQuestion(
          pattern,
          'division',
          pattern.correctAnswer,
          pattern.firstOperand,
        )
      }
      return generateNearbyNumberQuestion(pattern)
    case 'division':
      return createSimilarQuestion(
        pattern,
        'multiplication',
        pattern.secondOperand,
        pattern.correctAnswer,
      )
  }
}

export function generateSimilarQuestion(pattern: MistakePattern): Question {
  const generators = [
    generateNearbyNumberQuestion,
    generateReversedOperandQuestion,
    generateFactFamilyQuestion,
  ]
  const generator = generators[Math.floor(Math.random() * generators.length)]
  return generator(pattern)
}
