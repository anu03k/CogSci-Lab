import { useContext } from 'react'
import { ResultsContext } from './ResultsContext'
import type { ResultsContextValue } from './ResultsContext'

export function useResults(): ResultsContextValue {
  const ctx = useContext(ResultsContext)
  if (!ctx) throw new Error('useResults must be used within ResultsProvider')
  return ctx
}
