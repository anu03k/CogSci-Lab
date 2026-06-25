import type {
  GambleOption,
  ProspectState,
  ProspectResult,
  RiskState,
  RiskResult,
  DecisionMakingResult,
} from './decisionMaking.types'

function computeVariance(option: GambleOption): number {
  const ev = option.expectedValue
  return (
    option.winProbability * Math.pow(option.winAmount - ev, 2) +
    option.loseProbability * Math.pow(-option.loseAmount - ev, 2)
  )
}

export function computeProspectResult(state: ProspectState, durationMs: number): ProspectResult {
  const { scenarios, responses } = state
  const total = scenarios.length

  let rationalChoices = 0
  let psychologicalChoices = 0

  for (const scenario of scenarios) {
    const response = responses[scenario.id]
    if (response === undefined) continue
    if (response === scenario.rationalChoice) rationalChoices++
    if (response === scenario.psychologicalChoice) psychologicalChoices++
  }

  const consistencyScore = total > 0 ? (rationalChoices / total) * 100 : 0

  // Loss aversion: chose the risky option in loss scenarios (to avoid the certain loss) > 50%
  const lossScenarios = scenarios.filter((s) => s.category === 'loss')
  const lossRiskyChoiceCount = lossScenarios.filter((s) => {
    const r = responses[s.id]
    if (r === undefined) return false
    return (r === 'A' ? s.optionA : s.optionB).isRisky
  }).length
  const lossAversionEvidence =
    lossScenarios.length > 0 ? lossRiskyChoiceCount / lossScenarios.length > 0.5 : false

  // Gain seeking: chose the risky option in gain scenarios > 50%
  const gainScenarios = scenarios.filter((s) => s.category === 'gain')
  const gainRiskyChoiceCount = gainScenarios.filter((s) => {
    const r = responses[s.id]
    if (r === undefined) return false
    return (r === 'A' ? s.optionA : s.optionB).isRisky
  }).length
  const gainSeeking =
    gainScenarios.length > 0 ? gainRiskyChoiceCount / gainScenarios.length > 0.5 : false

  // Temporal discounting: chose the immediate option (A) in temporal scenarios > 50%
  const temporalScenarios = scenarios.filter((s) => s.category === 'temporal')
  const immediateChoiceCount = temporalScenarios.filter((s) => responses[s.id] === 'A').length
  const temporalDiscounting =
    temporalScenarios.length > 0
      ? immediateChoiceCount / temporalScenarios.length > 0.5
      : false

  const dominantPattern: ProspectResult['dominantPattern'] =
    lossAversionEvidence && !gainSeeking
      ? 'loss-averse'
      : gainSeeking && !lossAversionEvidence
        ? 'risk-seeking'
        : consistencyScore > 70
          ? 'rational'
          : 'mixed'

  return {
    totalScenarios: total,
    responses,
    rationalChoices,
    psychologicalChoices,
    consistencyScore,
    lossAversionEvidence,
    gainSeeking,
    temporalDiscounting,
    dominantPattern,
    durationMs,
  }
}

export function computeRiskResult(state: RiskState, durationMs: number): RiskResult {
  const { gambles, responses } = state
  const total = gambles.length

  let safeChoices = 0
  let riskyChoices = 0
  let evAlignedCount = 0

  for (const gamble of gambles) {
    const response = responses[gamble.id]
    if (response === undefined) continue

    const varA = computeVariance(gamble.optionA)
    const varB = computeVariance(gamble.optionB)
    const safeOption: 'A' | 'B' = varA <= varB ? 'A' : 'B'

    if (response === safeOption) {
      safeChoices++
    } else {
      riskyChoices++
    }
    if (response === gamble.betterExpectedValue) evAlignedCount++
  }

  const expectedValueAlignment = total > 0 ? (evAlignedCount / total) * 100 : 0
  const riskScore = total > 0 ? (riskyChoices / total) * 100 : 0
  const riskProfile: RiskResult['riskProfile'] =
    riskScore < 35 ? 'Risk-Averse' : riskScore <= 65 ? 'Moderate' : 'Risk-Seeking'

  return {
    totalGambles: total,
    responses,
    safeChoices,
    riskyChoices,
    expectedValueAlignment,
    riskProfile,
    riskScore,
    durationMs,
  }
}

export function computeFinalResult(
  prospect: ProspectResult,
  risk: RiskResult,
): DecisionMakingResult {
  const combinedRiskScore = (risk.riskScore + (prospect.gainSeeking ? 60 : 30)) / 2

  const lossAversionScore =
    prospect.dominantPattern === 'loss-averse' ? 80 : prospect.lossAversionEvidence ? 55 : 25

  const overallProfile: DecisionMakingResult['overallProfile'] =
    combinedRiskScore < 35 ? 'Risk-Averse' : combinedRiskScore <= 65 ? 'Balanced' : 'Risk-Seeking'

  return {
    prospect,
    risk,
    overallProfile,
    lossAversionScore,
    combinedRiskScore,
  }
}
