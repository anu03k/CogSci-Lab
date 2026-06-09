import type { ExperimentResult } from '@/shared/types/experiment.types'

type AnyResult = ExperimentResult<unknown>

const KEY = 'cogsci-lab-results'

function load(): AnyResult[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as AnyResult[]) : []
  } catch {
    return []
  }
}

export const resultsStorage = {
  save(result: AnyResult): void {
    const existing = load()
    localStorage.setItem(KEY, JSON.stringify([...existing, result]))
  },
  load,
  clear(): void {
    localStorage.removeItem(KEY)
  },
}
