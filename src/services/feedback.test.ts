import { describe, expect, it } from 'vitest'
import { feedbackMessage, feedbackMessages } from './feedback'

describe('feedback messages', () => {
  it('selects a positive message for a self-reported correct result', () => {
    expect(feedbackMessage(true, () => 0)).toBe(
      feedbackMessages.correctMessages[0],
    )
    expect(feedbackMessage(true, () => 0.99)).toBe(
      feedbackMessages.correctMessages.at(-1),
    )
  })

  it('selects a supportive message for a self-reported incorrect result', () => {
    expect(feedbackMessage(false, () => 0)).toBe(
      feedbackMessages.supportiveMessages[0],
    )
    expect(feedbackMessage(false, () => 0.99)).toBe(
      feedbackMessages.supportiveMessages.at(-1),
    )
  })
})
