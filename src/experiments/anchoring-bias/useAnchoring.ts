import { useReducer, useMemo } from 'react'
import { anchoringReducer, getInitialState } from './anchoringReducer'
import { computeFinalResult } from './anchoring.utils'
import type { ExperimentState, Action, AnchoringResult } from './anchoring.types'

interface UseAnchoringReturn {
  state: ExperimentState
  dispatch: (action: Action) => void
  finalResult: AnchoringResult | null
}

export function useAnchoring(): UseAnchoringReturn {
  const [state, dispatch] = useReducer(anchoringReducer, undefined, getInitialState)

  const finalResult = useMemo<AnchoringResult | null>(() => {
    if (state.classicResult === null || state.wheelResult === null) return null
    return computeFinalResult(state.classicResult, state.wheelResult)
  }, [state.classicResult, state.wheelResult])

  return { state, dispatch, finalResult }
}
