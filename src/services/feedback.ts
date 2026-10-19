const correctMessages = [
  'Great thinking! Keep going!',
  'Nice work — you are building strong math skills!',
  'You gave that one a careful check. Awesome!',
]

const supportiveMessages = [
  'That is okay — mistakes help your brain grow.',
  'Keep practicing. You can try a new one now!',
  'Thanks for being honest. Every try helps!',
]

export function feedbackMessage(
  selfReportedCorrect: boolean,
  random = Math.random,
): string {
  const messages = selfReportedCorrect ? correctMessages : supportiveMessages
  return messages[Math.floor(random() * messages.length)]
}

export const feedbackMessages = { correctMessages, supportiveMessages }
