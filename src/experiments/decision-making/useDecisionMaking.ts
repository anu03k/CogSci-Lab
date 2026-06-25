import { useReducer, useMemo } from 'react'
import { decisionMakingReducer, getInitialState } from './decisionMakingReducer'
import { computeFinalResult } from './decisionMaking.utils'
import type { ExperimentState, Action, DecisionMakingResult } from './decisionMaking.types'

interface UseDecisionMakingReturn {
  state: ExperimentState
  dispatch: (action: Action) => void
  finalResult: DecisionMakingResult | null
}

export function useDecisionMaking(): UseDecisionMakingReturn {
  const [state, dispatch] = useReducer(decisionMakingReducer, undefined, getInitialState)

  const finalResult = useMemo<DecisionMakingResult | null>(() => {
    if (state.prospectResult === null || state.riskResult === null) return null
    return computeFinalResult(state.prospectResult, state.riskResult)
  }, [state.prospectResult, state.riskResult])

  return { state, dispatch, finalResult }
}
