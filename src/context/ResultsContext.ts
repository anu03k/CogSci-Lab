import { createContext } from 'react'
import type { ExperimentResult } from '@/shared/types/experiment.types'

export type AnyResult = ExperimentResult<unknown>

export interface ResultsContextValue {
  results: AnyResult[]
  addResult: (result: AnyResult) => void
  clearResults: () => void
}

export const ResultsContext = createContext<ResultsContextValue | null>(null)
