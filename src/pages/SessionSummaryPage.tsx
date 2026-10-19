import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ErrorMessage } from '../components/common/ErrorMessage'
import type { SessionSummaryData } from '../types/math'

interface SummaryLocationState {
  summary?: SessionSummaryData
}

export function SessionSummaryPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as SummaryLocationState | null
  const summary = state?.summary

  if (!summary) {
    return (
      <ErrorMessage
        title="We could not find that session."
        message="That summary is no longer available, but your saved practice progress is safe."
        actionLabel="Start practice"
        actionTo="/setup"
      />
    )
  }

  const { session, setup } = summary
  const accuracy =
    session.attemptedCount === 0
      ? 0
      : Math.round((session.correctCount / session.attemptedCount) * 100)

  return (
    <section
      className="content-panel summary-panel"
      aria-labelledby="summary-title"
    >
      <p className="eyebrow">Session complete</p>
      <h1 id="summary-title">Nice work!</h1>
      <p>You finished your practice session. Here is how it went.</p>
      <dl className="summary-stats">
        <div>
          <dt>Attempted</dt>
          <dd>{session.attemptedCount}</dd>
        </div>
        <div>
          <dt>Correct</dt>
          <dd>{session.correctCount}</dd>
        </div>
        <div>
          <dt>Incorrect</dt>
          <dd>{session.incorrectCount}</dd>
        </div>
        <div>
          <dt>Accuracy</dt>
          <dd>{accuracy}%</dd>
        </div>
      </dl>
      <p>
        <strong>Operations:</strong> {setup.operations.join(', ')}
      </p>
      <p>
        <strong>Difficulty:</strong> Level {setup.difficulty}
      </p>
      <p>
        <strong>Mistake-review questions:</strong> {session.mistakeReviewCount}
      </p>
      <div className="summary-actions">
        <button
          className="button button--primary"
          type="button"
          onClick={() => navigate('/practice', { state: { setup } })}
        >
          Practice again
        </button>
        <Link className="button button--secondary" to="/setup">
          Change settings
        </Link>
        <Link className="button button--secondary" to="/statistics">
          View statistics
        </Link>
        <Link className="button button--secondary" to="/">
          Return home
        </Link>
        <Link className="button button--secondary" to="/setup">
          Practice mistakes
        </Link>
      </div>
    </section>
  )
}
