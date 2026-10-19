import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { clearActiveSession } from '../services/storage'
import { ActiveSessionContext } from './activeSessionState'

export function ActiveSessionProvider({ children }: { children: ReactNode }) {
  const [hasActiveSession, setHasActiveSession] = useState(false)
  const confirmLeaveActiveSession = useCallback(() => {
    if (!hasActiveSession) return true
    const shouldLeave = window.confirm(
      'Leave this practice session? Your progress is saved so you can return later.',
    )
    if (!shouldLeave) return false
    clearActiveSession()
    setHasActiveSession(false)
    return true
  }, [hasActiveSession])

  const value = useMemo(
    () => ({
      hasActiveSession,
      setHasActiveSession,
      confirmLeaveActiveSession,
    }),
    [hasActiveSession, confirmLeaveActiveSession],
  )

  return (
    <ActiveSessionContext.Provider value={value}>
      {children}
    </ActiveSessionContext.Provider>
  )
}
