import { describe, expect, it } from 'vitest'
import { createSessionQuestion } from './questionGenerator'

describe('session question generation', () => {
  it('avoids immediately repeating the same operation and operands', () => {
    let previous = createSessionQuestion(['addition'], 1)

    for (let index = 0; index < 30; index += 1) {
      const current = createSessionQuestion(['addition'], 1, previous)
      expect(
        `${current.operation}:${current.firstOperand}:${current.secondOperand}`,
      ).not.toBe(
        `${previous.operation}:${previous.firstOperand}:${previous.secondOperand}`,
      )
      previous = current
    }
  })
})
