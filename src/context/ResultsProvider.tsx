import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ResultsContext } from './ResultsContext'
import type { AnyResult } from './ResultsContext'

const STORAGE_KEY = 'cogsci-lab-results'

function loadResults(): AnyResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AnyResult[]) : []
  } catch {
    return []
  }
}

export function ResultsProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<AnyResult[]>(loadResults)

  const addResult = useCallback((result: AnyResult) => {
    setResults((prev) => {
      const updated = [...prev, result]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearResults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setResults([])
  }, [])

  const value = useMemo(
    () => ({ results, addResult, clearResults }),
    [results, addResult, clearResults],
  )

  return <ResultsContext.Provider value={value}>{children}</ResultsContext.Provider>
}
