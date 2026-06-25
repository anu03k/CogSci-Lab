import type { ClassicState, ClassicResult, WheelState, WheelResult, AnchoringResult } from './anchoring.types'

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function computeClassicResult(state: ClassicState, durationMs: number): ClassicResult {
  const { scenario } = state
  const estimate1 = state.estimate1 ?? 0
  const estimate2 = state.estimate2 ?? 0
  const anchorDelta = estimate1 - estimate2
  const spread = scenario.highAnchorValue - scenario.lowAnchorValue
  const anchorInfluenceScore =
    spread > 0 ? clamp((Math.abs(anchorDelta) / spread) * 100, 0, 100) : 0
  const highAnchorBias: 'up' | 'down' | 'none' =
    anchorDelta > 10 ? 'up' : anchorDelta < -10 ? 'down' : 'none'

  return {
    scenarioId: scenario.id,
    topic: scenario.topic,
    actualAnswer: scenario.actualAnswer,
    highAnchorValue: scenario.highAnchorValue,
    lowAnchorValue: scenario.lowAnchorValue,
    estimate1,
    estimate2,
    anchorDelta,
    anchorInfluenceScore,
    highAnchorBias,
    durationMs,
  }
}

export function computeWheelResult(state: WheelState, durationMs: number): WheelResult {
  const { scenario } = state
  const wheelResult = state.wheelResult ?? 0
  const estimate = state.estimate ?? 0
  const deviationFromActual = Math.abs(estimate - scenario.actualAnswer)
  const deviationFromWheel = Math.abs(estimate - wheelResult)
  const wheelInfluenceScore =
    deviationFromActual === 0
      ? 0
      : clamp((1 - deviationFromWheel / deviationFromActual) * 100, 0, 100)

  return {
    scenarioId: scenario.id,
    topic: scenario.topic,
    actualAnswer: scenario.actualAnswer,
    wheelResult,
    estimate,
    deviationFromActual,
    deviationFromWheel,
    wheelInfluenceScore,
    durationMs,
  }
}

export function computeFinalResult(classic: ClassicResult, wheel: WheelResult): AnchoringResult {
  const combinedScore = (classic.anchorInfluenceScore + wheel.wheelInfluenceScore) / 2
  const overallAnchoringSusceptibility: 'Low' | 'Moderate' | 'High' =
    combinedScore < 30 ? 'Low' : combinedScore <= 60 ? 'Moderate' : 'High'

  return {
    classic,
    wheel,
    overallAnchoringSusceptibility,
    combinedScore,
  }
}
