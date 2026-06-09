import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExperimentShell } from '@/shared/components/ExperimentShell'
import { DistractorPhase } from './phases/DistractorPhase'
import { RecallPhase } from './phases/RecallPhase'
import { StudyPhase } from './phases/StudyPhase'
import { FalseMemoryResults } from './FalseMemoryResults'
import { FalseMemoryPhase } from './falseMemory.types'
import { useFalseMemory } from './useFalseMemory'

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = result[i]
    const b = result[j]
    if (a !== undefined && b !== undefined) {
      result[i] = b
      result[j] = a
    }
  }
  return result
}

const phaseProgress: Record<
  FalseMemoryPhase,
  { current: number; total: number } | undefined
> = {
  Study: { current: 1, total: 3 },
  Distractor: { current: 2, total: 3 },
  Recall: { current: 3, total: 3 },
  Results: undefined,
}

export function FalseMemoryExperiment() {
  const navigate = useNavigate()
  const { state, dispatch, result, startExperiment } = useFalseMemory()

  const recallOptions = useMemo(() => {
    const all = [
      ...state.currentList.studyWords,
      state.currentList.lureWord,
      ...state.currentList.distractors,
    ]
    return shuffle(all)
  }, [state.currentList])

  if (state.phase === FalseMemoryPhase.Results) {
    if (!result) return null
    return (
      <FalseMemoryResults
        result={result}
        onRetry={startExperiment}
        onHome={() => void navigate('/experiments')}
      />
    )
  }

  function renderPhase() {
    switch (state.phase) {
      case FalseMemoryPhase.Study:
        return (
          <StudyPhase
            words={state.currentList.studyWords}
            onComplete={() => dispatch({ type: 'ADVANCE_PHASE' })}
          />
        )
      case FalseMemoryPhase.Distractor:
        return (
          <DistractorPhase
            onComplete={() => dispatch({ type: 'ADVANCE_PHASE' })}
          />
        )
      case FalseMemoryPhase.Recall:
        return (
          <RecallPhase
            options={recallOptions}
            selectedWords={state.selectedWords}
            onToggle={(word) => dispatch({ type: 'TOGGLE_WORD', word })}
            onComplete={(confidence) => {
              dispatch({ type: 'SET_CONFIDENCE', rating: confidence })
              dispatch({ type: 'COMPLETE' })
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div data-testid="false-memory-experiment">
      <ExperimentShell
        title="False Memory"
        progress={phaseProgress[state.phase]}
        onExit={() => void navigate('/experiments')}
      >
        {renderPhase()}
      </ExperimentShell>
    </div>
  )
}
