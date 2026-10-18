import { Link, useLocation } from 'react-router-dom'
import type { PracticeSetupConfig } from '../types/math'

interface PracticeLocationState {
  setup?: PracticeSetupConfig
}

const levelNames = {
  1: 'Beginner',
  2: 'Easy',
  3: 'Intermediate',
  4: 'Advanced',
} as const

export function PracticeUnavailablePage() {
  const location = useLocation()
  const state = location.state as PracticeLocationState | null
  const setup = state?.setup

  return (
    <section className="content-panel" aria-labelledby="practice-title">
      <h1 id="practice-title">Practice setup saved</h1>
      {setup ? (
        <div className="setup-summary" aria-label="Selected practice setup">
          <p>
            <strong>Operations:</strong> {setup.operations.join(', ')}
          </p>
          <p>
            <strong>Difficulty:</strong> Level {setup.difficulty} -{' '}
            {levelNames[setup.difficulty]}
          </p>
          <p>
            <strong>Session length:</strong>{' '}
            {setup.sessionLength === 'continuous'
              ? 'Continuous practice'
              : `${setup.sessionLength} questions`}
          </p>
        </div>
      ) : (
        <p>Choose your practice settings before starting.</p>
      )}
      <p className="muted-note">
        Question cards and sessions begin in a later phase.
      </p>
      <Link className="button button--primary" to="/setup">
        Change setup
      </Link>
    </section>
  )
}
