export type ExperimentId = 'false-memory' | 'anchoring-bias' | 'decision-making'

export interface ExperimentResult<TData> {
  id: string
  experimentId: ExperimentId
  completedAt: string
  durationMs: number
  data: TData
}

export interface ExperimentMeta {
  id: ExperimentId
  title: string
  subtitle: string
  duration: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  concepts: string[]
  route: string
}
