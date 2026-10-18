import { useState } from 'react'
import {
  clearPracticeHistory,
  loadAttempts,
  loadSessions,
} from '../services/storage'
import { accuracy, calculateStatistics } from '../services/statistics'
import type {
  DifficultyLevel,
  MathOperation,
  PracticeSession,
} from '../types/math'

const operationLabels: Record<MathOperation, string> = {
  addition: 'Addition',
  subtraction: 'Subtraction',
  multiplication: 'Multiplication',
  division: 'Division',
}

function StatCard({
  label,
  attempted,
  correct,
  incorrect,
}: {
  label: string
  attempted: number
  correct: number
  incorrect: number
}) {
  return (
    <article className="stat-card">
      <h2>{label}</h2>
      <p>
        <strong>{attempted}</strong> attempted
      </p>
      <p>
        {correct} correct · {incorrect} incorrect
      </p>
      <p>{accuracy({ attempted, correct, incorrect })}% accuracy</p>
    </article>
  )
}

export function StatisticsPage() {
  const [attempts, setAttempts] = useState(loadAttempts)
  const [sessions, setSessions] = useState(loadSessions)
  const statistics = calculateStatistics(attempts)
  const recentSessions = [...sessions]
    .sort((left, right) =>
      (right.completedAt ?? right.startedAt).localeCompare(
        left.completedAt ?? left.startedAt,
      ),
    )
    .slice(0, 5)

  const resetStatistics = () => {
    if (
      !window.confirm(
        'Erase all practice history and statistics? Your settings will stay the same.',
      )
    )
      return
    clearPracticeHistory()
    setAttempts([])
    setSessions([])
  }

  return (
    <section className="statistics-page" aria-labelledby="statistics-title">
      <div className="page-heading">
        <p className="eyebrow">Your progress</p>
        <h1 id="statistics-title">Statistics</h1>
      </div>
      {attempts.length === 0 ? (
        <div className="content-panel">
          <p>
            No questions yet. Start a practice session to see your progress
            here.
          </p>
        </div>
      ) : (
        <>
          <div className="stat-grid">
            <StatCard label="Overall" {...statistics} />
          </div>
          <h2>By operation</h2>
          <div className="stat-grid">
            {(Object.keys(operationLabels) as MathOperation[]).map(
              (operation) => (
                <StatCard
                  key={operation}
                  label={operationLabels[operation]}
                  {...statistics.byOperation[operation]}
                />
              ),
            )}
          </div>
          <h2>By difficulty</h2>
          <div className="stat-grid">
            {([1, 2, 3, 4] as DifficultyLevel[]).map((difficulty) => (
              <StatCard
                key={difficulty}
                label={`Level ${difficulty}`}
                {...statistics.byDifficulty[difficulty]}
              />
            ))}
          </div>
        </>
      )}
      <section
        className="recent-sessions"
        aria-labelledby="recent-sessions-title"
      >
        <h2 id="recent-sessions-title">Recent sessions</h2>
        {recentSessions.length === 0 ? (
          <p>No completed sessions yet.</p>
        ) : (
          <ul>
            {recentSessions.map((session) => (
              <SessionRow key={session.id} session={session} />
            ))}
          </ul>
        )}
      </section>
      <button
        className="button button--secondary"
        type="button"
        onClick={resetStatistics}
      >
        Reset statistics
      </button>
    </section>
  )
}

function SessionRow({ session }: { session: PracticeSession }) {
  const sessionAccuracy = accuracy({
    attempted: session.attemptedCount,
    correct: session.correctCount,
    incorrect: session.incorrectCount,
  })
  return (
    <li>
      <strong>
        {new Date(
          session.completedAt ?? session.startedAt,
        ).toLocaleDateString()}
      </strong>{' '}
      - {session.operations.join(', ')}, Level {session.difficulty}:{' '}
      {session.correctCount}/{session.attemptedCount} correct ({sessionAccuracy}
      %)
    </li>
  )
}
