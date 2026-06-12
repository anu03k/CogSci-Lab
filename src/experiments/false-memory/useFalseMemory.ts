import { useReducer, useMemo } from 'react'
import { falseMemoryReducer, getInitialState } from './falseMemoryReducer'
import { computeFinalResult } from './falseMemory.utils'
import type { ExperimentState, Action, FalseMemoryResult } from './falseMemory.types'

interface UseFalseMemoryReturn {
  state: ExperimentState
  dispatch: (action: Action) => void
  finalResult: FalseMemoryResult | null
}

export function useFalseMemory(): UseFalseMemoryReturn {
  const [state, dispatch] = useReducer(falseMemoryReducer, undefined, getInitialState)

  const finalResult = useMemo<FalseMemoryResult | null>(() => {
    if (state.drmResult === null || state.misinformationResult === null) return null
    return computeFinalResult(state.drmResult, state.misinformationResult)
  }, [state.drmResult, state.misinformationResult])

  return { state, dispatch, finalResult }
}
