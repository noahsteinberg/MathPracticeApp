import type { Question } from '../types/math'
import { shuffle } from '../utils/math'

function validDistractor(question: Question, candidate: number): boolean {
  return (
    Number.isInteger(candidate) &&
    candidate >= 0 &&
    candidate !== question.correctAnswer
  )
}

function operationSpecificCandidates(question: Question): number[] {
  const { correctAnswer, firstOperand, secondOperand, operation } = question

  switch (operation) {
    case 'addition':
      return [
        correctAnswer - firstOperand,
        correctAnswer - secondOperand,
        correctAnswer + 1,
        correctAnswer - 1,
      ]
    case 'subtraction':
      return [
        correctAnswer + secondOperand,
        firstOperand + secondOperand,
        correctAnswer + 1,
        correctAnswer - 1,
      ]
    case 'multiplication':
      return [
        (firstOperand + 1) * secondOperand,
        firstOperand * (secondOperand + 1),
        correctAnswer + firstOperand,
        correctAnswer - firstOperand,
      ]
    case 'division':
      return [
        correctAnswer + 1,
        correctAnswer - 1,
        correctAnswer + secondOperand,
        firstOperand - secondOperand,
      ]
  }
}

export function generateAnswerChoices(question: Question): number[] {
  const candidates = operationSpecificCandidates(question)
  const uniqueDistractors = new Set<number>()

  for (const candidate of candidates) {
    if (validDistractor(question, candidate)) uniqueDistractors.add(candidate)
  }

  let offset = 2
  while (uniqueDistractors.size < 3) {
    const candidate = question.correctAnswer + offset
    if (validDistractor(question, candidate)) uniqueDistractors.add(candidate)
    offset += 1
  }

  return shuffle([question.correctAnswer, ...uniqueDistractors].slice(0, 4))
}

export function addAnswerChoices(question: Question): Question {
  return { ...question, choices: generateAnswerChoices(question) }
}
