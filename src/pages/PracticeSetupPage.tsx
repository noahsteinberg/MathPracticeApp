import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { activeMistakePatterns } from '../services/mistakeReview'
import { loadMistakePatterns, loadSettings } from '../services/storage'
import type {
  DifficultyLevel,
  MathOperation,
  PracticeSetupConfig,
  ReviewMode,
  SessionLength,
} from '../types/math'

const operations: Array<{
  value: MathOperation
  label: string
  symbol: string
}> = [
  { value: 'addition', label: 'Addition', symbol: '+' },
  { value: 'subtraction', label: 'Subtraction', symbol: '-' },
  { value: 'multiplication', label: 'Multiplication', symbol: 'x' },
  { value: 'division', label: 'Division', symbol: '/' },
]

const difficulties: Array<{
  value: DifficultyLevel
  label: string
  description: string
}> = [
  {
    value: 1,
    label: 'Beginner',
    description: 'Start with friendly number facts.',
  },
  {
    value: 2,
    label: 'Easy',
    description: 'Build confidence with bigger numbers.',
  },
  {
    value: 3,
    label: 'Intermediate',
    description: 'Try trickier number combinations.',
  },
  { value: 4, label: 'Advanced', description: 'Take on a big math challenge.' },
]

const sessionLengths: Array<{ value: SessionLength; label: string }> = [
  { value: 5, label: '5 questions' },
  { value: 10, label: '10 questions' },
  { value: 20, label: '20 questions' },
  { value: 'continuous', label: 'Keep going' },
]

export function PracticeSetupPage() {
  const navigate = useNavigate()
  const defaults = loadSettings()
  const [selectedOperations, setSelectedOperations] = useState<MathOperation[]>(
    defaults.defaultOperations,
  )
  const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(
    defaults.defaultDifficulty,
  )
  const [sessionLength, setSessionLength] = useState<SessionLength | null>(
    defaults.defaultSessionLength,
  )
  const [reviewMode, setReviewMode] = useState<ReviewMode>('regular')
  const activePatterns = activeMistakePatterns(loadMistakePatterns())
  const matchingReviewPatterns = activeMistakePatterns(
    activePatterns,
    selectedOperations,
    difficulty ?? undefined,
  )
  const reviewAvailable = activePatterns.length > 0

  const toggleOperation = (operation: MathOperation) => {
    setSelectedOperations((current) =>
      current.includes(operation)
        ? current.filter((item) => item !== operation)
        : [...current, operation],
    )
  }

  const selectAllOperations = () =>
    setSelectedOperations(operations.map((operation) => operation.value))

  const isValid =
    selectedOperations.length > 0 &&
    difficulty !== null &&
    sessionLength !== null &&
    (reviewMode === 'regular' || matchingReviewPatterns.length > 0)

  const startPractice = () => {
    if (!isValid || difficulty === null || sessionLength === null) return

    const setup: PracticeSetupConfig = {
      operations: selectedOperations,
      difficulty,
      sessionLength,
      reviewMode,
    }

    navigate('/practice', { state: { setup } })
  }

  return (
    <section className="setup-page" aria-labelledby="setup-title">
      <div className="page-heading">
        <p className="eyebrow">Make it your own</p>
        <h1 id="setup-title">Set up your practice</h1>
        <p>Choose what you would like to work on today.</p>
      </div>

      <form
        className="setup-form"
        onSubmit={(event) => {
          event.preventDefault()
          startPractice()
        }}
      >
        <fieldset>
          <legend>What would you like to practice?</legend>
          <p className="field-help">Choose one or more operations.</p>
          <div className="choice-grid choice-grid--operations">
            {operations.map((operation) => {
              const checked = selectedOperations.includes(operation.value)
              return (
                <label className="choice-card" key={operation.value}>
                  <input
                    type="checkbox"
                    aria-label={operation.label}
                    checked={checked}
                    onChange={() => toggleOperation(operation.value)}
                  />
                  <span aria-hidden="true" className="choice-symbol">
                    {operation.symbol}
                  </span>
                  <span>{operation.label}</span>
                </label>
              )
            })}
          </div>
          <div className="inline-actions">
            <button
              className="text-button"
              type="button"
              onClick={selectAllOperations}
            >
              Select all
            </button>
            <button
              className="text-button"
              type="button"
              onClick={() => setSelectedOperations([])}
              disabled={selectedOperations.length === 0}
            >
              Clear selection
            </button>
          </div>
        </fieldset>

        <fieldset>
          <legend>How challenging should it be?</legend>
          <div className="choice-grid choice-grid--difficulty">
            {difficulties.map((option) => (
              <label
                className="choice-card choice-card--detail"
                key={option.value}
              >
                <input
                  type="radio"
                  aria-label={`Level ${option.value}: ${option.label}`}
                  name="difficulty"
                  value={option.value}
                  checked={difficulty === option.value}
                  onChange={() => setDifficulty(option.value)}
                />
                <span>
                  <strong>
                    Level {option.value}: {option.label}
                  </strong>
                  <small>{option.description}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>How many questions?</legend>
          <div className="choice-grid choice-grid--length">
            {sessionLengths.map((option) => (
              <label className="choice-card" key={option.label}>
                <input
                  type="radio"
                  aria-label={option.label}
                  name="session-length"
                  value={option.value}
                  checked={sessionLength === option.value}
                  onChange={() => setSessionLength(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Which kind of practice?</legend>
          <div className="choice-grid choice-grid--length">
            <label className="choice-card">
              <input
                type="radio"
                aria-label="Regular practice"
                name="review-mode"
                checked={reviewMode === 'regular'}
                onChange={() => setReviewMode('regular')}
              />
              <span>Regular practice</span>
            </label>
            <label className="choice-card">
              <input
                type="radio"
                aria-label="Practice mistakes"
                name="review-mode"
                checked={reviewMode === 'mistake-review'}
                disabled={!reviewAvailable}
                onChange={() => setReviewMode('mistake-review')}
              />
              <span>Practice mistakes</span>
            </label>
          </div>
          <p className="field-help" aria-live="polite">
            {reviewAvailable
              ? `${activePatterns.length} active mistake ${activePatterns.length === 1 ? 'pattern is' : 'patterns are'} ready to review.`
              : 'Practice mistakes is unavailable until you have an active mistake pattern.'}
            {reviewMode === 'mistake-review' &&
            matchingReviewPatterns.length === 0
              ? ' Adjust your operations or difficulty to match an active mistake.'
              : ''}
          </p>
        </fieldset>

        <button
          className="button button--primary setup-submit"
          disabled={!isValid}
          type="submit"
        >
          Start practice
        </button>
      </form>
    </section>
  )
}
