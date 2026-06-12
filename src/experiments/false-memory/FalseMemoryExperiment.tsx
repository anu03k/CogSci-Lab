import { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExperimentShell } from '@/shared/components/ExperimentShell'
import { FalseMemoryPhase } from './falseMemory.types'
import { useFalseMemory } from './useFalseMemory'
import { FalseMemoryResults } from './FalseMemoryResults'
import {
  IntroPhase,
  DRMStudyPhase,
  DRMDistractPhase,
  DRMFreeRecallPhase,
  DRMRecognitionPhase,
  DRMMiniResultPhase,
  MisIntroPhase,
  MisNarrativePhase,
  MisQuestionsPhase,
  MisRecognitionPhase,
} from './phases'

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

const PHASE_STEP: Record<FalseMemoryPhase, number> = {
  [FalseMemoryPhase.Intro]: 1,
  [FalseMemoryPhase.DRM_Study]: 2,
  [FalseMemoryPhase.DRM_Distract]: 3,
  [FalseMemoryPhase.DRM_FreeRecall]: 4,
  [FalseMemoryPhase.DRM_Recognition]: 5,
  [FalseMemoryPhase.DRM_MiniResult]: 6,
  [FalseMemoryPhase.Mis_Intro]: 7,
  [FalseMemoryPhase.Mis_Narrative]: 8,
  [FalseMemoryPhase.Mis_Questions]: 9,
  [FalseMemoryPhase.Mis_Recognition]: 10,
  [FalseMemoryPhase.FinalResults]: 10,
}

export function FalseMemoryExperiment() {
  const navigate = useNavigate()
  const { state, dispatch, finalResult } = useFalseMemory()

  // Track when DRM study begins so we can compute an accurate durationMs.
  // Initialised to Date.now() as a safe fallback; overwritten when the phase
  // actually reaches DRM_Study, and reset to 0 when Intro is re-entered (retry).
  const drmStartRef = useRef(Date.now())
  useEffect(() => {
    if (state.phase === FalseMemoryPhase.DRM_Study) {
      drmStartRef.current = Date.now()
    }
    if (state.phase === FalseMemoryPhase.Intro) {
      drmStartRef.current = Date.now() // reset on retry
    }
  }, [state.phase])

  // Compute the shuffled recognition word pool exactly once.
  // state.drm.lists is set at initialisation and the reference never changes —
  // only currentListIndex advances — so this dep is stable across all DRM phases.
  const recognitionOptions = useMemo(() => {
    const all = [
      ...state.drm.lists.flatMap((l) => l.studyWords),
      ...state.drm.lists.map((l) => l.lureWord),
      ...state.drm.lists.flatMap((l) => l.distractorWords),
    ]
    return shuffle(all)
  }, [state.drm.lists])

  function renderPhase() {
    switch (state.phase) {
      case FalseMemoryPhase.Intro:
        return (
          <IntroPhase
            onStart={() => dispatch({ type: 'SET_PHASE', phase: FalseMemoryPhase.DRM_Study })}
          />
        )

      case FalseMemoryPhase.DRM_Study:
        return (
          <DRMStudyPhase
            lists={state.drm.lists}
            currentListIndex={state.drm.currentListIndex}
            onListComplete={(i) => dispatch({ type: 'SET_DRM_LIST_INDEX', index: i + 1 })}
            onAllListsComplete={() =>
              dispatch({ type: 'SET_PHASE', phase: FalseMemoryPhase.DRM_Distract })
            }
          />
        )

      case FalseMemoryPhase.DRM_Distract:
        return (
          <DRMDistractPhase
            onComplete={() =>
              dispatch({ type: 'SET_PHASE', phase: FalseMemoryPhase.DRM_FreeRecall })
            }
          />
        )

      case FalseMemoryPhase.DRM_FreeRecall:
        return (
          <DRMFreeRecallPhase
            onComplete={(text) => {
              dispatch({ type: 'SET_FREE_RECALL_TEXT', text })
              dispatch({ type: 'SET_PHASE', phase: FalseMemoryPhase.DRM_Recognition })
            }}
          />
        )

      case FalseMemoryPhase.DRM_Recognition:
        return (
          <DRMRecognitionPhase
            options={recognitionOptions}
            selected={state.drm.selectedRecognitionWords}
            onToggle={(word) => dispatch({ type: 'TOGGLE_DRM_RECOGNITION', word })}
            onComplete={() =>
              dispatch({
                type: 'COMPLETE_DRM',
                durationMs: Date.now() - drmStartRef.current,
              })
            }
          />
        )

      case FalseMemoryPhase.DRM_MiniResult:
        // Safe: DRM_MiniResult phase is only reached via COMPLETE_DRM,
        // which always populates state.drmResult before setting this phase.
        return (
          <DRMMiniResultPhase
            drmResult={state.drmResult!}
            onContinue={() => {
              dispatch({ type: 'INIT_MISINFORMATION' })
              // INIT_MISINFORMATION sets the scenario but does not advance the phase;
              // we explicitly advance to Mis_Intro here.
              dispatch({ type: 'SET_PHASE', phase: FalseMemoryPhase.Mis_Intro })
            }}
          />
        )

      case FalseMemoryPhase.Mis_Intro:
        return (
          <MisIntroPhase
            onStart={() => dispatch({ type: 'SET_PHASE', phase: FalseMemoryPhase.Mis_Narrative })}
          />
        )

      case FalseMemoryPhase.Mis_Narrative:
        // Safe: Mis_Narrative is only reachable after INIT_MISINFORMATION has run,
        // which always sets state.misinformation.scenario to a non-null value.
        return (
          <MisNarrativePhase
            scenario={state.misinformation.scenario!}
            onComplete={() =>
              dispatch({ type: 'SET_PHASE', phase: FalseMemoryPhase.Mis_Questions })
            }
          />
        )

      case FalseMemoryPhase.Mis_Questions:
        // Safe: same guarantee as Mis_Narrative — scenario is set before this phase.
        // scenario.misleadingQuestions contains both 'misleading' and 'neutral' types
        // per the data schema; we pass the full array so all questions are shown.
        return (
          <MisQuestionsPhase
            questions={state.misinformation.scenario!.misleadingQuestions}
            responses={state.misinformation.questionResponses}
            onAnswer={(questionId, answer) =>
              dispatch({ type: 'SET_MIS_QUESTION_RESPONSE', questionId, answer })
            }
            onComplete={() =>
              dispatch({ type: 'SET_PHASE', phase: FalseMemoryPhase.Mis_Recognition })
            }
          />
        )

      case FalseMemoryPhase.Mis_Recognition:
        // Safe: same guarantee as Mis_Narrative.
        return (
          <MisRecognitionPhase
            items={state.misinformation.scenario!.recognitionItems}
            selections={state.misinformation.recognitionSelections}
            onToggle={(itemId) => dispatch({ type: 'TOGGLE_MIS_RECOGNITION', itemId })}
            onComplete={() =>
              dispatch({
                type: 'COMPLETE_MISINFORMATION',
                durationMs: Date.now() - state.misinformation.startTime,
              })
            }
          />
        )

      case FalseMemoryPhase.FinalResults:
        // Safe: FinalResults is only reached via COMPLETE_MISINFORMATION, which
        // populates both drmResult and misinformationResult, making finalResult
        // non-null (as computed by useMemo in useFalseMemory).
        if (finalResult === null) return null
        return (
          <FalseMemoryResults
            result={finalResult}
            onRetry={() => dispatch({ type: 'RESET' })}
            onHome={() => void navigate('/experiments')}
          />
        )

      default:
        return null
    }
  }

  return (
    <div data-testid="false-memory-experiment">
      <ExperimentShell
        title="False Memory Lab"
        progress={{ current: PHASE_STEP[state.phase], total: 10 }}
        onExit={() => void navigate('/experiments')}
      >
        {renderPhase()}
      </ExperimentShell>
    </div>
  )
}
