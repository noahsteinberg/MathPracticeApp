import type { MathOperation } from '../types/math'

export function randomInteger(minimum: number, maximum: number): number {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
}

export function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = randomInteger(0, index)
    ;[shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ]
  }

  return shuffled
}

export function operationSymbol(operation: MathOperation): string {
  return {
    addition: '+',
    subtraction: '-',
    multiplication: 'x',
    division: '/',
  }[operation]
}
