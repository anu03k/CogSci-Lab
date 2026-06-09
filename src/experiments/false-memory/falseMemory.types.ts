export const FalseMemoryPhase = {
  Study: 'Study',
  Distractor: 'Distractor',
  Recall: 'Recall',
  Results: 'Results',
} as const

export type FalseMemoryPhase =
  (typeof FalseMemoryPhase)[keyof typeof FalseMemoryPhase]

export interface WordList {
  id: string
  theme: string
  lureWord: string
  studyWords: string[]
  distractors: string[]
}

export interface FalseMemoryState {
  phase: FalseMemoryPhase
  currentList: WordList
  startTime: number
  selectedWords: Set<string>
  confidenceRating: number | null
}

export interface FalseMemoryResult {
  wordListId: string
  studiedWords: string[]
  lureWord: string
  selectedWords: string[]
  correctRecalls: number
  falseRecalls: number
  lureSelected: boolean
  confidenceRating: number
  accuracyPct: number
  durationMs: number
}
