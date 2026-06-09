import { useCallback, useReducer } from 'react'
import { getRandomList } from './falseMemory.data'
import {
  FalseMemoryPhase,
  type FalseMemoryResult,
  type FalseMemoryState,
} from './falseMemory.types'

// ─── Action union ────────────────────────────────────────────────────────────

export type Action =
  | { type: 'ADVANCE_PHASE' }
  | { type: 'TOGGLE_WORD'; word: string }
  | { type: 'SET_CONFIDENCE'; rating: number }
  | { type: 'COMPLETE' }

type InternalAction = Action | { type: '__RESET' }

// ─── State ───────────────────────────────────────────────────────────────────

interface InternalState {
  experiment: FalseMemoryState
  result: FalseMemoryResult | null
}

const phaseOrder: FalseMemoryPhase[] = [
  FalseMemoryPhase.Study,
  FalseMemoryPhase.Distractor,
  FalseMemoryPhase.Recall,
  FalseMemoryPhase.Results,
]

function createInitialState(): FalseMemoryState {
  return {
    phase: FalseMemoryPhase.Study,
    currentList: getRandomList(),
    startTime: Date.now(),
    selectedWords: new Set<string>(),
    confidenceRating: null,
  }
}

// ─── Result computation ───────────────────────────────────────────────────────

function computeResult(state: FalseMemoryState): FalseMemoryResult {
  const { currentList, selectedWords, confidenceRating, startTime } = state
  const studyWordSet = new Set(currentList.studyWords)
  const selectedArr = Array.from(selectedWords)

  const correctRecalls = selectedArr.filter((w) => studyWordSet.has(w)).length
  const falseRecalls = selectedArr.filter((w) => !studyWordSet.has(w)).length
  const lureSelected = selectedWords.has(currentList.lureWord)
  const accuracyPct =
    currentList.studyWords.length > 0
      ? Math.round((correctRecalls / currentList.studyWords.length) * 100)
      : 0

  return {
    wordListId: currentList.id,
    studiedWords: [...currentList.studyWords],
    lureWord: currentList.lureWord,
    selectedWords: selectedArr,
    correctRecalls,
    falseRecalls,
    lureSelected,
    confidenceRating: confidenceRating ?? 1,
    accuracyPct,
    durationMs: Date.now() - startTime,
  }
}

// ─── Experiment sub-reducer ───────────────────────────────────────────────────

function experimentReducer(state: FalseMemoryState, action: Action): FalseMemoryState {
  switch (action.type) {
    case 'ADVANCE_PHASE': {
      const currentIdx = phaseOrder.indexOf(state.phase)
      const nextIdx = currentIdx === -1 ? 0 : currentIdx + 1
      const nextPhase = phaseOrder[nextIdx] ?? state.phase
      return { ...state, phase: nextPhase }
    }
    case 'TOGGLE_WORD': {
      const next = new Set(state.selectedWords)
      if (next.has(action.word)) {
        next.delete(action.word)
      } else {
        next.add(action.word)
      }
      return { ...state, selectedWords: next }
    }
    case 'SET_CONFIDENCE':
      return { ...state, confidenceRating: action.rating }
    case 'COMPLETE':
      return { ...state, phase: FalseMemoryPhase.Results }
    default:
      return state
  }
}

// ─── Full reducer (includes result computation + reset) ───────────────────────

function fullReducer(state: InternalState, action: InternalAction): InternalState {
  if (action.type === '__RESET') {
    return { experiment: createInitialState(), result: null }
  }
  const next = experimentReducer(state.experiment, action)
  const result =
    action.type === 'COMPLETE' ? computeResult(state.experiment) : state.result
  return { experiment: next, result }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFalseMemory() {
  const [{ experiment: state, result }, internalDispatch] = useReducer(
    fullReducer,
    undefined,
    (): InternalState => ({ experiment: createInitialState(), result: null }),
  )

  const dispatch = useCallback((action: Action) => {
    internalDispatch(action)
  }, [])

  const startExperiment = useCallback(() => {
    internalDispatch({ type: '__RESET' })
  }, [])

  return { state, dispatch, result, startExperiment }
}
