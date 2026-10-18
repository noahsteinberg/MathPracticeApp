import { useState } from 'react'
import type { Question } from '../../types/math'
import { AnswerChoice } from './AnswerChoice'

interface QuestionCardProps {
  question: Question
  animationsEnabled?: boolean
  onResult: (result: {
    selectedAnswer: number
    selfReportedCorrect: boolean
  }) => void
}

export function QuestionCard({
  question,
  animationsEnabled,
  onResult,
}: QuestionCardProps) {
  return (
    <QuestionCardContent
      key={question.id}
      question={question}
      animationsEnabled={animationsEnabled}
      onResult={onResult}
    />
  )
}

function QuestionCardContent({
  question,
  animationsEnabled = true,
  onResult,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [resultRecorded, setResultRecorded] = useState(false)

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
        animationsEnabled ? '' : 'question-card--no-animation',
      ].join(' ')}
      aria-live="polite"
    >
      {!isFlipped ? (
        <div className="question-card__face">
          <p className="eyebrow">Choose your answer</p>
          <h2>{question.displayText}</h2>
          <div
            className="answer-grid"
            role="radiogroup"
            aria-label="Answer choices"
          >
            {question.choices.map((answer) => (
              <AnswerChoice
                key={answer}
                answer={answer}
                checked={selectedAnswer === answer}
                disabled={false}
                onSelect={setSelectedAnswer}
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
