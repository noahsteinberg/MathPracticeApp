import type { PracticeSession } from '../types/math'

export const RECENT_SESSION_LIMIT = 5

/** Keeps the statistics page useful without rendering an unbounded session list. */
export function recentSessions(sessions: PracticeSession[]): PracticeSession[] {
  return [...sessions]
    .sort((left, right) =>
      (right.completedAt ?? right.startedAt).localeCompare(
        left.completedAt ?? left.startedAt,
      ),
    )
    .slice(0, RECENT_SESSION_LIMIT)
}
