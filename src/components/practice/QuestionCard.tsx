import { useCallback, useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import type { Question } from '../../types/math'
import { AnswerChoice } from './AnswerChoice'

interface QuestionCardProps {
  question: Question
  animationsEnabled?: boolean
  initialSelectedAnswer?: number | null
  onSelectedAnswerChange?: (selectedAnswer: number | null) => void
  onResult: (result: {
    selectedAnswer: number
    selfReportedCorrect: boolean
  }) => void
}

export function QuestionCard({
  question,
  animationsEnabled,
  initialSelectedAnswer,
  onSelectedAnswerChange,
  onResult,
}: QuestionCardProps) {
  return (
    <QuestionCardContent
      key={question.id}
      question={question}
      animationsEnabled={animationsEnabled}
      initialSelectedAnswer={initialSelectedAnswer}
      onSelectedAnswerChange={onSelectedAnswerChange}
      onResult={onResult}
    />
  )
}

function QuestionCardContent({
  question,
  animationsEnabled = true,
  initialSelectedAnswer = null,
  onSelectedAnswerChange,
  onResult,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(
    initialSelectedAnswer,
  )
  const [isFlipped, setIsFlipped] = useState(false)
  const [resultRecorded, setResultRecorded] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const shouldAnimate = animationsEnabled && !prefersReducedMotion
  const selectAnswer = useCallback(
    (answer: number) => {
      setSelectedAnswer(answer)
      onSelectedAnswerChange?.(answer)
    },
    [onSelectedAnswerChange],
  )

  useEffect(() => {
    const selectNumberedAnswer = (event: KeyboardEvent) => {
      const target = event.target
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable) ||
        isFlipped ||
        resultRecorded
      ) {
        return
      }
      const choiceNumber = Number(event.key)
      if (choiceNumber < 1 || choiceNumber > question.choices.length) return
      event.preventDefault()
      selectAnswer(question.choices[choiceNumber - 1])
    }

    window.addEventListener('keydown', selectNumberedAnswer)
    return () => window.removeEventListener('keydown', selectNumberedAnswer)
  }, [isFlipped, question.choices, resultRecorded, selectAnswer])

  const recordResult = (selfReportedCorrect: boolean) => {
    if (selectedAnswer === null || resultRecorded) return
    setResultRecorded(true)
    onResult({ selectedAnswer, selfReportedCorrect })
  }

  return (
    <section
      className={[
        'question-card',
        isFlipped ? 'question-card--flipped' : '',
        shouldAnimate ? '' : 'question-card--no-animation',
      ].join(' ')}
    >
      <p className="sr-only" role="status" aria-atomic="true">
        {isFlipped
          ? `Answer revealed. Your answer is ${selectedAnswer}. The correct answer is ${question.correctAnswer}.`
          : `New question: ${question.displayText} Choose one of four answers.`}
      </p>
      {!isFlipped ? (
        <div className="question-card__face">
          <p className="eyebrow">Choose your answer</p>
          <h2>{question.displayText}</h2>
          <div
            className="answer-grid"
            role="radiogroup"
            aria-label="Answer choices"
          >
            {question.choices.map((answer, index) => (
              <AnswerChoice
                key={answer}
                answer={answer}
                choiceNumber={index + 1}
                checked={selectedAnswer === answer}
                disabled={false}
                onSelect={selectAnswer}
              />
            ))}
          </div>
          <button
            className="button button--primary"
            disabled={selectedAnswer === null}
            type="button"
            onClick={() => setIsFlipped(true)}
          >
            Flip card
          </button>
          <p className="question-card__shortcut" aria-hidden="true">
            Tip: press 1–4 to choose an answer.
          </p>
        </div>
      ) : (
        <div className="question-card__face question-card__face--back">
          <p className="eyebrow">Answer revealed</p>
          <h2>
            {question.displayText.replace('?', String(question.correctAnswer))}
          </h2>
          <p>
            Your answer: <strong>{selectedAnswer}</strong>
          </p>
          <p>
            Correct answer: <strong>{question.correctAnswer}</strong>
          </p>
          <div className="result-actions">
            <button
              className="button button--primary"
              disabled={resultRecorded}
              type="button"
              onClick={() => recordResult(true)}
            >
              I got it right
            </button>
            <button
              className="button button--secondary"
              disabled={resultRecorded}
              type="button"
              onClick={() => recordResult(false)}
            >
              I got it wrong
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
