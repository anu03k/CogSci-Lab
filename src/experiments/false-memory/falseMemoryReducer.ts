import { FalseMemoryPhase } from './falseMemory.types'
import type { ExperimentState, Action } from './falseMemory.types'
import { getRandomDRMSet, getRandomScenario } from './falseMemory.data'
import { computeDRMResult, computeMisinformationResult } from './falseMemory.utils'

export function getInitialState(): ExperimentState {
  return {
    phase: FalseMemoryPhase.Intro,
    drm: {
      currentListIndex: 0,
      studyStartTime: 0,
      freeRecallText: '',
      selectedRecognitionWords: new Set<string>(),
      lists: getRandomDRMSet(),
      distractorAnswers: {},
    },
    misinformation: {
      scenario: null,
      questionResponses: {},
      recognitionSelections: new Set<string>(),
      startTime: 0,
    },
    drmResult: null,
    misinformationResult: null,
    experimentStartTime: 0,
  }
}

export function falseMemoryReducer(state: ExperimentState, action: Action): ExperimentState {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.phase }

    case 'SET_DRM_LIST_INDEX':
      return { ...state, drm: { ...state.drm, currentListIndex: action.index } }

    case 'SET_DISTRACTOR_ANSWER':
      return {
        ...state,
        drm: {
          ...state.drm,
          distractorAnswers: { ...state.drm.distractorAnswers, [action.listIndex]: action.answer },
        },
      }

    case 'SET_FREE_RECALL_TEXT':
      return { ...state, drm: { ...state.drm, freeRecallText: action.text } }

    case 'TOGGLE_DRM_RECOGNITION': {
      const prev = state.drm.selectedRecognitionWords
      const next = prev.has(action.word)
        ? new Set([...prev].filter((w) => w !== action.word))
        : new Set([...prev, action.word])
      return { ...state, drm: { ...state.drm, selectedRecognitionWords: next } }
    }

    case 'COMPLETE_DRM': {
      const drmResult = computeDRMResult(state.drm, action.durationMs)
      return { ...state, drmResult, phase: FalseMemoryPhase.DRM_MiniResult }
    }

    case 'INIT_MISINFORMATION':
      return {
        ...state,
        misinformation: {
          ...state.misinformation,
          scenario: getRandomScenario(),
          startTime: Date.now(),
        },
      }

    case 'SET_MIS_QUESTION_RESPONSE':
      return {
        ...state,
        misinformation: {
          ...state.misinformation,
          questionResponses: {
            ...state.misinformation.questionResponses,
            [action.questionId]: action.answer,
          },
        },
      }

    case 'TOGGLE_MIS_RECOGNITION': {
      const prev = state.misinformation.recognitionSelections
      const next = prev.has(action.itemId)
        ? new Set([...prev].filter((id) => id !== action.itemId))
        : new Set([...prev, action.itemId])
      return {
        ...state,
        misinformation: { ...state.misinformation, recognitionSelections: next },
      }
    }

    case 'COMPLETE_MISINFORMATION': {
      const { scenario, questionResponses, recognitionSelections } = state.misinformation
      if (scenario === null) return state
      const misinformationResult = computeMisinformationResult(
        scenario,
        questionResponses,
        recognitionSelections,
        action.durationMs,
      )
      return { ...state, misinformationResult, phase: FalseMemoryPhase.FinalResults }
    }

    case 'RESET':
      return getInitialState()

    default:
      return state
  }
}
