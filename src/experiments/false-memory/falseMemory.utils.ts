import type {
  DRMState,
  DRMResult,
  MisinformationScenario,
  MisinformationResult,
  FalseMemoryResult,
} from './falseMemory.types'

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function computeDRMResult(state: DRMState, durationMs: number): DRMResult {
  const freeRecalledWords = state.freeRecallText
    .toLowerCase()
    .split(/[\s,\n]+/)
    .filter((w) => w.length > 0)

  const studiedWords = state.lists.flatMap((list) => list.studyWords)
  const lureWords = state.lists.map((list) => list.lureWord)
  const recognitionSelected = [...state.selectedRecognitionWords]

  const studiedWordsSet = new Set(studiedWords)
  const lureWordsSet = new Set(lureWords)

  const correctRecognitions = recognitionSelected.filter((w) => studiedWordsSet.has(w)).length
  const falseRecognitions = recognitionSelected.filter((w) => !studiedWordsSet.has(w)).length
  const luresSelected = recognitionSelected.filter((w) => lureWordsSet.has(w))

  const lureHitRate = lureWords.length > 0 ? luresSelected.length / lureWords.length : 0
  const totalPossibleRecognition = studiedWords.length + lureWords.length + 12

  const drmFalseMemoryScore = clamp(
    lureHitRate * 60 + (falseRecognitions / totalPossibleRecognition) * 40,
    0,
    100,
  )

  return {
    listsStudied: state.lists.length,
    lureWords,
    studiedWords,
    freeRecalledWords,
    recognitionSelected,
    correctRecognitions,
    falseRecognitions,
    luresSelected,
    lureHitRate,
    drmFalseMemoryScore,
    durationMs,
  }
}

export function computeMisinformationResult(
  scenario: MisinformationScenario,
  questionResponses: Record<string, string>,
  recognitionSelections: Set<string>,
  durationMs: number,
): MisinformationResult {
  const allQuestions = scenario.misleadingQuestions
  const misleadingOnly = allQuestions.filter((q) => q.type === 'misleading')

  const questionResponsesArray = allQuestions.map((q) => {
    const selectedAnswer = questionResponses[q.id] ?? ''
    return { questionId: q.id, selectedAnswer, wasMisled: selectedAnswer === q.misleadingAnswer }
  })

  const misleadedCount = questionResponsesArray.filter((r) => {
    const q = allQuestions.find((q) => q.id === r.questionId)
    return q?.type === 'misleading' && r.wasMisled
  }).length

  const misleadingQuestionAcceptanceRate =
    misleadingOnly.length > 0 ? misleadedCount / misleadingOnly.length : 0

  const recognitionResponsesArray = scenario.recognitionItems.map((item) => ({
    itemId: item.id,
    selected: recognitionSelections.has(item.id),
  }))

  const plantedItems = scenario.recognitionItems.filter((item) => item.isPlanted)
  const plantedItemsRecognized = plantedItems.filter((item) =>
    recognitionSelections.has(item.id),
  ).length
  const actualItemsRecognized = scenario.recognitionItems.filter(
    (item) => item.isFromNarrative && recognitionSelections.has(item.id),
  ).length

  const plantedRate = plantedItems.length > 0 ? plantedItemsRecognized / plantedItems.length : 0

  const misinformationScore = clamp(
    misleadingQuestionAcceptanceRate * 50 + plantedRate * 50,
    0,
    100,
  )

  return {
    scenarioId: scenario.id,
    questionResponses: questionResponsesArray,
    recognitionResponses: recognitionResponsesArray,
    misleadingQuestionAcceptanceRate,
    plantedItemsRecognized,
    actualItemsRecognized,
    misinformationScore,
    durationMs,
  }
}

export function computeFinalResult(drm: DRMResult, mis: MisinformationResult): FalseMemoryResult {
  const combinedScore = (drm.drmFalseMemoryScore + mis.misinformationScore) / 2

  const overallFalseMemoryTendency: 'Low' | 'Moderate' | 'High' =
    combinedScore < 30 ? 'Low' : combinedScore <= 60 ? 'Moderate' : 'High'

  const dominantMechanism: 'Endogenous' | 'Exogenous' | 'Both' =
    drm.drmFalseMemoryScore > mis.misinformationScore + 20
      ? 'Endogenous'
      : mis.misinformationScore > drm.drmFalseMemoryScore + 20
        ? 'Exogenous'
        : 'Both'

  return {
    drm,
    misinformation: mis,
    overallFalseMemoryTendency,
    dominantMechanism,
    combinedScore,
  }
}
