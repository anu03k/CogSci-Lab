export const FalseMemoryPhase = {
  Intro: 'Intro',
  DRM_Study: 'DRM_Study',
  DRM_Distract: 'DRM_Distract',
  DRM_FreeRecall: 'DRM_FreeRecall',
  DRM_Recognition: 'DRM_Recognition',
  DRM_MiniResult: 'DRM_MiniResult',
  Mis_Intro: 'Mis_Intro',
  Mis_Narrative: 'Mis_Narrative',
  Mis_Questions: 'Mis_Questions',
  Mis_Recognition: 'Mis_Recognition',
  FinalResults: 'FinalResults',
} as const

export type FalseMemoryPhase = (typeof FalseMemoryPhase)[keyof typeof FalseMemoryPhase]

export interface WordList {
  id: string
  theme: string
  lureWord: string
  studyWords: string[]
  distractorWords: string[]
}

export interface DRMState {
  currentListIndex: number
  studyStartTime: number
  freeRecallText: string
  selectedRecognitionWords: Set<string>
  lists: WordList[]
  distractorAnswers: Record<number, string>
}

export interface DRMResult {
  listsStudied: number
  lureWords: string[]
  studiedWords: string[]
  freeRecalledWords: string[]
  recognitionSelected: string[]
  correctRecognitions: number
  falseRecognitions: number
  luresSelected: string[]
  lureHitRate: number
  drmFalseMemoryScore: number
  durationMs: number
}

export interface MisinformationQuestion {
  id: string
  questionText: string
  type: 'misleading' | 'neutral'
  plantedDetail: string | null
  options: string[]
  correctAnswer: string
  misleadingAnswer: string
}

export interface RecognitionItem {
  id: string
  text: string
  isFromNarrative: boolean
  isPlanted: boolean
  isDistractor: boolean
}

export interface MisinformationScenario {
  id: string
  title: string
  narrativeText: string
  misleadingQuestions: MisinformationQuestion[]
  recognitionItems: RecognitionItem[]
}

export interface MisinformationResult {
  scenarioId: string
  questionResponses: Array<{ questionId: string; selectedAnswer: string; wasMisled: boolean }>
  recognitionResponses: Array<{ itemId: string; selected: boolean }>
  misleadingQuestionAcceptanceRate: number
  plantedItemsRecognized: number
  actualItemsRecognized: number
  misinformationScore: number
  durationMs: number
}

export interface FalseMemoryResult {
  drm: DRMResult
  misinformation: MisinformationResult
  overallFalseMemoryTendency: 'Low' | 'Moderate' | 'High'
  dominantMechanism: 'Endogenous' | 'Exogenous' | 'Both'
  combinedScore: number
}

export interface MisinformationState {
  scenario: MisinformationScenario | null
  questionResponses: Record<string, string>
  recognitionSelections: Set<string>
  startTime: number
}

export interface ExperimentState {
  phase: FalseMemoryPhase
  drm: DRMState
  misinformation: MisinformationState
  drmResult: DRMResult | null
  misinformationResult: MisinformationResult | null
  experimentStartTime: number
}

export type Action =
  | { type: 'SET_PHASE'; phase: FalseMemoryPhase }
  | { type: 'SET_DRM_LIST_INDEX'; index: number }
  | { type: 'SET_DISTRACTOR_ANSWER'; listIndex: number; answer: string }
  | { type: 'SET_FREE_RECALL_TEXT'; text: string }
  | { type: 'TOGGLE_DRM_RECOGNITION'; word: string }
  | { type: 'COMPLETE_DRM'; durationMs: number }
  | { type: 'INIT_MISINFORMATION' }
  | { type: 'SET_MIS_QUESTION_RESPONSE'; questionId: string; answer: string }
  | { type: 'TOGGLE_MIS_RECOGNITION'; itemId: string }
  | { type: 'COMPLETE_MISINFORMATION'; durationMs: number }
  | { type: 'RESET' }
