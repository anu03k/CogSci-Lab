import { AnchoringPhase } from './anchoring.types'
import type { ExperimentState, Action } from './anchoring.types'
import { getRandomScenario, getRandomWheelScenario } from './anchoring.data'
import { computeClassicResult, computeWheelResult } from './anchoring.utils'

export function getInitialState(): ExperimentState {
  return {
    phase: AnchoringPhase.Intro,
    classic: {
      scenario: getRandomScenario(),
      highAnchorResponse: null,
      estimate1: null,
      lowAnchorResponse: null,
      estimate2: null,
      startTime: 0,
    },
    wheel: {
      scenario: getRandomWheelScenario(),
      wheelResult: null,
      estimate: null,
      startTime: 0,
    },
    classicResult: null,
    wheelResult: null,
    experimentStartTime: Date.now(),
  }
}

export function anchoringReducer(state: ExperimentState, action: Action): ExperimentState {
  switch (action.type) {
    case 'SET_PHASE': {
      const next = { ...state, phase: action.phase }
      if (action.phase === AnchoringPhase.Classic_HighAnchor) {
        return { ...next, classic: { ...next.classic, startTime: Date.now() } }
      }
      if (action.phase === AnchoringPhase.Wheel_Intro) {
        return { ...next, wheel: { ...next.wheel, startTime: Date.now() } }
      }
      return next
    }

    case 'SET_HIGH_ANCHOR_RESPONSE':
      return { ...state, classic: { ...state.classic, highAnchorResponse: action.response } }

    case 'SET_ESTIMATE_1':
      return { ...state, classic: { ...state.classic, estimate1: action.value } }

    case 'SET_LOW_ANCHOR_RESPONSE':
      return { ...state, classic: { ...state.classic, lowAnchorResponse: action.response } }

    case 'SET_ESTIMATE_2':
      return { ...state, classic: { ...state.classic, estimate2: action.value } }

    case 'COMPLETE_CLASSIC': {
      const durationMs = Date.now() - state.classic.startTime
      const classicResult = computeClassicResult(state.classic, durationMs)
      return { ...state, classicResult, phase: AnchoringPhase.Classic_MiniResult }
    }

    case 'SET_WHEEL_RESULT':
      return { ...state, wheel: { ...state.wheel, wheelResult: action.value } }

    case 'SET_WHEEL_ESTIMATE':
      return { ...state, wheel: { ...state.wheel, estimate: action.value } }

    case 'COMPLETE_WHEEL': {
      const durationMs = Date.now() - state.wheel.startTime
      const wheelResult = computeWheelResult(state.wheel, durationMs)
      return { ...state, wheelResult, phase: AnchoringPhase.FinalResults }
    }

    case 'RESET':
      return getInitialState()

    default:
      return state
  }
}
