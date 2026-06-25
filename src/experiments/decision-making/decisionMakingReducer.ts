import { DecisionMakingPhase } from './decisionMaking.types'
import type { ExperimentState, Action } from './decisionMaking.types'
import { getShuffledScenarios, getShuffledGambles } from './decisionMaking.data'
import { computeProspectResult, computeRiskResult } from './decisionMaking.utils'

export function getInitialState(): ExperimentState {
  return {
    phase: DecisionMakingPhase.Intro,
    prospect: {
      scenarios: getShuffledScenarios(),
      currentIndex: 0,
      responses: {},
      startTime: 0,
    },
    risk: {
      gambles: getShuffledGambles(),
      currentIndex: 0,
      responses: {},
      startTime: 0,
    },
    prospectResult: null,
    riskResult: null,
    experimentStartTime: Date.now(),
  }
}

export function decisionMakingReducer(state: ExperimentState, action: Action): ExperimentState {
  switch (action.type) {
    case 'SET_PHASE': {
      const next = { ...state, phase: action.phase }
      if (action.phase === DecisionMakingPhase.Prospect_Scenario) {
        return { ...next, prospect: { ...next.prospect, startTime: Date.now() } }
      }
      if (action.phase === DecisionMakingPhase.Risk_Gamble) {
        return { ...next, risk: { ...next.risk, startTime: Date.now() } }
      }
      return next
    }

    case 'ANSWER_PROSPECT': {
      const newResponses = {
        ...state.prospect.responses,
        [action.scenarioId]: action.choice,
      }
      const newProspect = {
        ...state.prospect,
        responses: newResponses,
        currentIndex: state.prospect.currentIndex + 1,
      }

      const isLast =
        state.prospect.currentIndex === state.prospect.scenarios.length - 1
      if (isLast) {
        const durationMs = Date.now() - state.prospect.startTime
        const prospectResult = computeProspectResult(newProspect, durationMs)
        return {
          ...state,
          prospect: newProspect,
          prospectResult,
          phase: DecisionMakingPhase.Prospect_MiniResult,
        }
      }

      return { ...state, prospect: newProspect }
    }

    case 'ANSWER_GAMBLE': {
      const newResponses = {
        ...state.risk.responses,
        [action.gambleId]: action.choice,
      }
      const newRisk = {
        ...state.risk,
        responses: newResponses,
        currentIndex: state.risk.currentIndex + 1,
      }

      const isLast = state.risk.currentIndex === state.risk.gambles.length - 1
      if (isLast) {
        const durationMs = Date.now() - state.risk.startTime
        const riskResult = computeRiskResult(newRisk, durationMs)
        return {
          ...state,
          risk: newRisk,
          riskResult,
          phase: DecisionMakingPhase.FinalResults,
        }
      }

      return { ...state, risk: newRisk }
    }

    case 'RESET':
      return getInitialState()

    default:
      return state
  }
}
