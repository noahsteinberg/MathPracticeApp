import type { DifficultyLevel, MathOperation, Question } from '../types/math'
import { operationSymbol, randomInteger } from '../utils/math'
import { addAnswerChoices } from './answerChoices'

interface Operands {
  firstOperand: number
  secondOperand: number
}

function maxOperandForDifficulty(difficulty: DifficultyLevel): number {
  return [10, 50, 100, 1000][difficulty - 1]
}

function generateAdditionOperands(difficulty: DifficultyLevel): Operands {
  const maximum = maxOperandForDifficulty(difficulty)
  return {
    firstOperand: randomInteger(0, maximum),
    secondOperand: randomInteger(0, maximum),
  }
}

function generateSubtractionOperands(difficulty: DifficultyLevel): Operands {
  const maximum = maxOperandForDifficulty(difficulty)
  const firstOperand = randomInteger(0, maximum)
  return { firstOperand, secondOperand: randomInteger(0, firstOperand) }
}

function generateMultiplicationOperands(difficulty: DifficultyLevel): Operands {
  if (difficulty === 1)
    return {
      firstOperand: randomInteger(0, 5),
      secondOperand: randomInteger(0, 5),
    }
  if (difficulty === 2)
    return {
      firstOperand: randomInteger(0, 10),
      secondOperand: randomInteger(0, 10),
    }
  if (difficulty === 3) {
    return {
      firstOperand: randomInteger(1, 9),
      secondOperand:
        Math.random() < 0.5 ? randomInteger(1, 9) : randomInteger(10, 99),
    }
  }
  return {
    firstOperand: randomInteger(10, 99),
    secondOperand:
      Math.random() < 0.5 ? randomInteger(1, 9) : randomInteger(10, 99),
  }
}

function generateDivisionOperands(difficulty: DifficultyLevel): Operands {
  const [maximumDivisor, maximumQuotient] =
    difficulty === 1
      ? [5, 10]
      : difficulty === 2
        ? [10, 10]
        : difficulty === 3
          ? [12, 12]
          : [25, 40]
  const secondOperand = randomInteger(1, maximumDivisor)
  const quotient = randomInteger(0, maximumQuotient)
  return { firstOperand: secondOperand * quotient, secondOperand }
}

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

export function generateQuestion(
  operation: MathOperation,
  difficulty: DifficultyLevel,
): Question {
  const operands =
    operation === 'addition'
      ? generateAdditionOperands(difficulty)
      : operation === 'subtraction'
        ? generateSubtractionOperands(difficulty)
        : operation === 'multiplication'
          ? generateMultiplicationOperands(difficulty)
          : generateDivisionOperands(difficulty)
  const correctAnswer = calculateAnswer(
    operation,
    operands.firstOperand,
    operands.secondOperand,
  )

  return {
    id: crypto.randomUUID(),
    operation,
    ...operands,
    displayText: `${operands.firstOperand} ${operationSymbol(operation)} ${operands.secondOperand} = ?`,
    correctAnswer,
    choices: [],
    difficulty,
    source: 'regular',
  }
}

export function createQuestion(
  operation: MathOperation,
  difficulty: DifficultyLevel,
): Question {
  return addAnswerChoices(generateQuestion(operation, difficulty))
}

function questionSignature(question: Question): string {
  return `${question.operation}:${question.firstOperand}:${question.secondOperand}`
}

export function createSessionQuestion(
  operations: MathOperation[],
  difficulty: DifficultyLevel,
  previousQuestion?: Question,
): Question {
  const previousSignature =
    previousQuestion && questionSignature(previousQuestion)

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const operation = operations[Math.floor(Math.random() * operations.length)]
    const question = createQuestion(operation, difficulty)
    if (questionSignature(question) !== previousSignature) return question
  }

  return createQuestion(operations[0], difficulty)
}
