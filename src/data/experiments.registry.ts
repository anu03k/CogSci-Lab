import type { ExperimentId, ExperimentMeta } from '@/shared/types/experiment.types'

export const EXPERIMENTS: ExperimentMeta[] = [
  {
    id: 'false-memory',
    title: 'False Memory',
    subtitle: 'Explore how suggestion shapes what we remember',
    duration: '~5 min',
    difficulty: 'Easy',
    concepts: [
      'Misinformation effect',
      'DRM paradigm',
      'Source monitoring',
      'Reconstructive memory',
    ],
    route: '/experiments/false-memory',
  },
  {
    id: 'anchoring-bias',
    title: 'Anchoring Bias',
    subtitle: 'Discover how first numbers warp your estimates',
    duration: '~4 min',
    difficulty: 'Easy',
    concepts: [
      'Cognitive anchoring',
      'Adjustment heuristic',
      'Numerical priming',
      'Judgement under uncertainty',
    ],
    route: '/experiments/anchoring-bias',
  },
  {
    id: 'decision-making',
    title: 'Decision Making Under Risk',
    subtitle: 'Test how framing and loss aversion guide your choices',
    duration: '~7 min',
    difficulty: 'Medium',
    concepts: [
      'Prospect theory',
      'Loss aversion',
      'Framing effect',
      'Expected utility',
      'Risk tolerance',
    ],
    route: '/experiments/decision-making',
  },
]

export function getExperiment(id: ExperimentId): ExperimentMeta {
  const found = EXPERIMENTS.find((e) => e.id === id)
  if (!found) throw new Error(`Experiment not found: ${id}`)
  return found
}
