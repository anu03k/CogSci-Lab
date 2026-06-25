export const DecisionMakingPhase = {
  Intro: 'Intro',
  Prospect_Scenario: 'Prospect_Scenario',
  Prospect_MiniResult: 'Prospect_MiniResult',
  Risk_Intro: 'Risk_Intro',
  Risk_Gamble: 'Risk_Gamble',
  FinalResults: 'FinalResults',
} as const

export type DecisionMakingPhase = (typeof DecisionMakingPhase)[keyof typeof DecisionMakingPhase]

export interface ScenarioOption {
  label: string
  description: string
  value: number
  probability: number
  isRisky: boolean
}

export interface ProspectScenario {
  id: string
  category: 'gain' | 'loss' | 'temporal'
  question: string
  optionA: ScenarioOption
  optionB: ScenarioOption
  rationalChoice: 'A' | 'B'
  psychologicalChoice: 'A' | 'B'
  conceptExplained: string
}

export interface ProspectState {
  scenarios: ProspectScenario[]
  currentIndex: number
  responses: Record<string, 'A' | 'B'>
  startTime: number
}

export interface ProspectResult {
  totalScenarios: number
  responses: Record<string, 'A' | 'B'>
  rationalChoices: number
  psychologicalChoices: number
  consistencyScore: number
  lossAversionEvidence: boolean
  gainSeeking: boolean
  temporalDiscounting: boolean
  dominantPattern: 'loss-averse' | 'risk-seeking' | 'rational' | 'mixed'
  durationMs: number
}

export interface GambleOption {
  description: string
  winAmount: number
  winProbability: number
  loseAmount: number
  loseProbability: number
  expectedValue: number
}

export interface GambleChoice {
  id: string
  question: string
  betterExpectedValue: 'A' | 'B'
  optionA: GambleOption
  optionB: GambleOption
}

export interface RiskState {
  gambles: GambleChoice[]
  currentIndex: number
  responses: Record<string, 'A' | 'B'>
  startTime: number
}

export interface RiskResult {
  totalGambles: number
  responses: Record<string, 'A' | 'B'>
  safeChoices: number
  riskyChoices: number
  expectedValueAlignment: number
  riskProfile: 'Risk-Averse' | 'Moderate' | 'Risk-Seeking'
  riskScore: number
  durationMs: number
}

export interface DecisionMakingResult {
  prospect: ProspectResult
  risk: RiskResult
  overallProfile: 'Risk-Averse' | 'Balanced' | 'Risk-Seeking'
  lossAversionScore: number
  combinedRiskScore: number
}

export interface ExperimentState {
  phase: DecisionMakingPhase
  prospect: ProspectState
  risk: RiskState
  prospectResult: ProspectResult | null
  riskResult: RiskResult | null
  experimentStartTime: number
}

export type Action =
  | { type: 'SET_PHASE'; phase: DecisionMakingPhase }
  | { type: 'ANSWER_PROSPECT'; scenarioId: string; choice: 'A' | 'B' }
  | { type: 'ANSWER_GAMBLE'; gambleId: string; choice: 'A' | 'B' }
  | { type: 'RESET' }
