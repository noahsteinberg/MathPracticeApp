import { createContext } from 'react'

export interface ActiveSessionContextValue {
  hasActiveSession: boolean
  setHasActiveSession: (hasActiveSession: boolean) => void
  confirmLeaveActiveSession: () => boolean
}

export const ActiveSessionContext =
  createContext<ActiveSessionContextValue | null>(null)
