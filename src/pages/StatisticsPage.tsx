import { memo, useMemo, useState } from 'react'
import {
  clearPracticeHistory,
  loadAttempts,
  loadMistakePatterns,
  loadSessions,
} from '../services/storage'
import { calculateMistakeStatistics } from '../services/mistakeStatistics'
import { recentSessions } from '../services/recentSessions'
import { accuracy, calculateStatistics } from '../services/statistics'
import type {
  DifficultyLevel,
  MathOperation,
  MistakePattern,
  PracticeSession,
} from '../types/math'

const operationLabels: Record<MathOperation, string> = {
  addition: 'Addition',
  subtraction: 'Subtraction',
  multiplication: 'Multiplication',
  division: 'Division',
}

const StatCard = memo(function StatCard({
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
})

export function StatisticsPage() {
  const [attempts, setAttempts] = useState(loadAttempts)
  const [sessions, setSessions] = useState(loadSessions)
  const [mistakePatterns] = useState(loadMistakePatterns)
  const statistics = useMemo(() => calculateStatistics(attempts), [attempts])
  const mistakeStatistics = useMemo(
    () => calculateMistakeStatistics(mistakePatterns, attempts),
    [mistakePatterns, attempts],
  )
  const recentSessionList = useMemo(() => recentSessions(sessions), [sessions])

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
      <section className="mistake-insights" aria-labelledby="mistake-title">
        <h2 id="mistake-title">Mistake review insights</h2>
        {mistakePatterns.length === 0 ? (
          <p>No mistake patterns yet. Keep practicing and we will spot them.</p>
        ) : (
          <>
            <div className="stat-grid">
              <StatCard
                label="Active mistakes"
                attempted={mistakeStatistics.activeCount}
                correct={0}
                incorrect={0}
              />
              <StatCard
                label="Mastered patterns"
                attempted={mistakeStatistics.masteredCount}
                correct={0}
                incorrect={0}
              />
              <StatCard
                label="Similar questions practiced"
                attempted={mistakeStatistics.reviewAttempted}
                correct={mistakeStatistics.reviewCorrect}
                incorrect={
                  mistakeStatistics.reviewAttempted -
                  mistakeStatistics.reviewCorrect
                }
              />
            </div>
            <p>
              <strong>Most missed operation:</strong>{' '}
              {mistakeStatistics.mostMissedOperations
                .map((operation) => operationLabels[operation])
                .join(', ')}
            </p>
            <h3>Most missed facts</h3>
            <MistakeList patterns={mistakeStatistics.mostMissedPatterns} />
            <h3>Active mistake patterns</h3>
            <MistakeList
              patterns={mistakeStatistics.sortedPatterns.filter(
                (pattern) => !pattern.isMastered,
              )}
            />
            <h3>Mastered patterns</h3>
            {mistakeStatistics.masteredCount === 0 ? (
              <p>No patterns mastered yet.</p>
            ) : (
              <MistakeList
                patterns={mistakeStatistics.sortedPatterns.filter(
                  (pattern) => pattern.isMastered,
                )}
              />
            )}
          </>
        )}
      </section>
      <section
        className="recent-sessions"
        aria-labelledby="recent-sessions-title"
      >
        <h2 id="recent-sessions-title">Recent sessions</h2>
        {recentSessionList.length === 0 ? (
          <p>No completed sessions yet.</p>
        ) : (
          <ul>
            {recentSessionList.map((session) => (
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

const MistakeList = memo(function MistakeList({
  patterns,
}: {
  patterns: MistakePattern[]
}) {
  if (patterns.length === 0) return <p>None right now.</p>
  return (
    <ul className="mistake-list">
      {patterns.map((pattern) => (
        <li key={pattern.id}>
          <strong>
            {pattern.firstOperand}{' '}
            {pattern.operation === 'addition'
              ? '+'
              : pattern.operation === 'subtraction'
                ? '-'
                : pattern.operation === 'multiplication'
                  ? '×'
                  : '÷'}{' '}
            {pattern.secondOperand}
          </strong>{' '}
          — {pattern.incorrectCount} incorrect; {pattern.similarCorrectCount}{' '}
          similar correct; last missed{' '}
          {new Date(pattern.lastIncorrectAt).toLocaleDateString()};{' '}
          {pattern.isMastered ? 'mastered' : 'active'}
        </li>
      ))}
    </ul>
  )
})

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
