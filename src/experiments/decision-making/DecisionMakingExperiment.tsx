import { useNavigate } from 'react-router-dom'
import { ExperimentShell } from '@/shared/components/ExperimentShell'
import { DecisionMakingPhase } from './decisionMaking.types'
import { useDecisionMaking } from './useDecisionMaking'
import { DecisionMakingResults } from './DecisionMakingResults'
import {
  IntroPhase,
  ProspectScenarioPhase,
  ProspectMiniResultPhase,
  RiskIntroPhase,
  GamblePhase,
} from './phases'

const PHASE_STEP: Record<DecisionMakingPhase, number> = {
  [DecisionMakingPhase.Intro]: 1,
  [DecisionMakingPhase.Prospect_Scenario]: 2,
  [DecisionMakingPhase.Prospect_MiniResult]: 3,
  [DecisionMakingPhase.Risk_Intro]: 4,
  [DecisionMakingPhase.Risk_Gamble]: 5,
  [DecisionMakingPhase.FinalResults]: 6,
}

export function DecisionMakingExperiment() {
  const navigate = useNavigate()
  const { state, dispatch, finalResult } = useDecisionMaking()

  function renderPhase() {
    switch (state.phase) {
      case DecisionMakingPhase.Intro:
        return (
          <IntroPhase
            onStart={() =>
              dispatch({ type: 'SET_PHASE', phase: DecisionMakingPhase.Prospect_Scenario })
            }
          />
        )

      case DecisionMakingPhase.Prospect_Scenario: {
        const scenario = state.prospect.scenarios[state.prospect.currentIndex]
        if (scenario === undefined) return null
        return (
          <ProspectScenarioPhase
            key={scenario.id}
            scenario={scenario}
            currentIndex={state.prospect.currentIndex}
            total={state.prospect.scenarios.length}
            onAnswer={(choice) =>
              dispatch({ type: 'ANSWER_PROSPECT', scenarioId: scenario.id, choice })
            }
          />
        )
      }

      case DecisionMakingPhase.Prospect_MiniResult:
        if (state.prospectResult === null) return null
        return (
          <ProspectMiniResultPhase
            prospectResult={state.prospectResult}
            onContinue={() =>
              dispatch({ type: 'SET_PHASE', phase: DecisionMakingPhase.Risk_Intro })
            }
          />
        )

      case DecisionMakingPhase.Risk_Intro:
        return (
          <RiskIntroPhase
            onStart={() =>
              dispatch({ type: 'SET_PHASE', phase: DecisionMakingPhase.Risk_Gamble })
            }
          />
        )

      case DecisionMakingPhase.Risk_Gamble: {
        const gamble = state.risk.gambles[state.risk.currentIndex]
        if (gamble === undefined) return null
        return (
          <GamblePhase
            key={gamble.id}
            gamble={gamble}
            currentIndex={state.risk.currentIndex}
            total={state.risk.gambles.length}
            onAnswer={(choice) =>
              dispatch({ type: 'ANSWER_GAMBLE', gambleId: gamble.id, choice })
            }
          />
        )
      }

      case DecisionMakingPhase.FinalResults:
        // Safe: FinalResults is only reached via ANSWER_GAMBLE on the last gamble,
        // which always computes riskResult and sets both results before this phase.
        if (finalResult === null) return null
        return (
          <DecisionMakingResults
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
    <div data-testid="decision-making-experiment">
      <ExperimentShell
        title="Decision Making Lab"
        progress={{ current: PHASE_STEP[state.phase], total: 6 }}
        onExit={() => void navigate('/experiments')}
      >
        {renderPhase()}
      </ExperimentShell>
    </div>
  )
}
