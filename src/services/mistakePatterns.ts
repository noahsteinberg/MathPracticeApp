import type { MistakePattern, Question } from '../types/math'
import { loadMistakePatterns, saveMistakePatterns } from './storage'

function canonicalOperands(question: Question): [number, number] {
  if (
    question.operation === 'addition' ||
    question.operation === 'multiplication'
  ) {
    return [
      Math.min(question.firstOperand, question.secondOperand),
      Math.max(question.firstOperand, question.secondOperand),
    ]
  }

  return [question.firstOperand, question.secondOperand]
}

export function mistakePatternId(question: Question): string {
  const [firstOperand, secondOperand] = canonicalOperands(question)
  return `${question.operation}:${firstOperand}:${secondOperand}:difficulty-${question.difficulty}`
}

export function upsertMistakePattern(
  patterns: MistakePattern[],
  question: Question,
  occurredAt = new Date().toISOString(),
): MistakePattern[] {
  const [firstOperand, secondOperand] = canonicalOperands(question)
  const id = mistakePatternId(question)
  const existingIndex = patterns.findIndex((pattern) => pattern.id === id)

  if (existingIndex >= 0) {
    return patterns.map((pattern, index) =>
      index === existingIndex
        ? {
            ...pattern,
            incorrectCount: pattern.incorrectCount + 1,
            lastIncorrectAt: occurredAt,
            similarCorrectCount: 0,
            isMastered: false,
          }
        : pattern,
    )
  }

  return [
    ...patterns,
    {
      id,
      operation: question.operation,
      firstOperand,
      secondOperand,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      lastIncorrectAt: occurredAt,
      incorrectCount: 1,
      similarCorrectCount: 0,
      isMastered: false,
    },
  ]
}

export function recordIncorrectQuestion(question: Question): boolean {
  return saveMistakePatterns(
    upsertMistakePattern(loadMistakePatterns(), question),
  )
}
