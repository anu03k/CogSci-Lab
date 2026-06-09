import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { ExperimentResult } from '@/shared/types/experiment.types'

type AnyResult = ExperimentResult<unknown>

interface ResultsContextValue {
  results: AnyResult[]
  addResult: (result: AnyResult) => void
  clearResults: () => void
}

const ResultsContext = createContext<ResultsContextValue | null>(null)

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

export function useResults(): ResultsContextValue {
  const ctx = useContext(ResultsContext)
  if (!ctx) throw new Error('useResults must be used within ResultsProvider')
  return ctx
}
