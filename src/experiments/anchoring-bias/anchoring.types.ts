export const AnchoringPhase = {
  Intro: 'Intro',
  Classic_HighAnchor: 'Classic_HighAnchor',
  Classic_Estimate1: 'Classic_Estimate1',
  Classic_LowAnchor: 'Classic_LowAnchor',
  Classic_Estimate2: 'Classic_Estimate2',
  Classic_MiniResult: 'Classic_MiniResult',
  Wheel_Intro: 'Wheel_Intro',
  Wheel_Spin: 'Wheel_Spin',
  Wheel_Estimate: 'Wheel_Estimate',
  FinalResults: 'FinalResults',
} as const

export type AnchoringPhase = (typeof AnchoringPhase)[keyof typeof AnchoringPhase]

export interface AnchorScenario {
  id: string
  topic: string
  actualAnswer: number
  actualAnswerLabel: string
  highAnchorQuestion: string
  highAnchorValue: number
  lowAnchorQuestion: string
  lowAnchorValue: number
  estimateQuestion: string
  unit: string
  minEstimate: number
  maxEstimate: number
}

export interface WheelScenario {
  id: string
  wheelNumbers: number[]
  estimateQuestion: string
  topic: string
  actualAnswer: number
  actualAnswerLabel: string
  unit: string
  minEstimate: number
  maxEstimate: number
}

export interface ClassicState {
  scenario: AnchorScenario
  highAnchorResponse: 'older' | 'younger' | null
  estimate1: number | null
  lowAnchorResponse: 'older' | 'younger' | null
  estimate2: number | null
  startTime: number
}

export interface ClassicResult {
  scenarioId: string
  topic: string
  actualAnswer: number
  highAnchorValue: number
  lowAnchorValue: number
  estimate1: number
  estimate2: number
  anchorDelta: number
  anchorInfluenceScore: number
  highAnchorBias: 'up' | 'down' | 'none'
  durationMs: number
}

export interface WheelState {
  scenario: WheelScenario
  wheelResult: number | null
  estimate: number | null
  startTime: number
}

export interface WheelResult {
  scenarioId: string
  topic: string
  actualAnswer: number
  wheelResult: number
  estimate: number
  deviationFromActual: number
  deviationFromWheel: number
  wheelInfluenceScore: number
  durationMs: number
}

export interface AnchoringResult {
  classic: ClassicResult
  wheel: WheelResult
  overallAnchoringSusceptibility: 'Low' | 'Moderate' | 'High'
  combinedScore: number
}

export interface ExperimentState {
  phase: AnchoringPhase
  classic: ClassicState
  wheel: WheelState
  classicResult: ClassicResult | null
  wheelResult: WheelResult | null
  experimentStartTime: number
}

export type Action =
  | { type: 'SET_PHASE'; phase: AnchoringPhase }
  | { type: 'SET_HIGH_ANCHOR_RESPONSE'; response: 'older' | 'younger' }
  | { type: 'SET_ESTIMATE_1'; value: number }
  | { type: 'SET_LOW_ANCHOR_RESPONSE'; response: 'older' | 'younger' }
  | { type: 'SET_ESTIMATE_2'; value: number }
  | { type: 'COMPLETE_CLASSIC' }
  | { type: 'SET_WHEEL_RESULT'; value: number }
  | { type: 'SET_WHEEL_ESTIMATE'; value: number }
  | { type: 'COMPLETE_WHEEL' }
  | { type: 'RESET' }
