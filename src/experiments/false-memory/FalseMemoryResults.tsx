import { useEffect, useRef } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ConceptCard } from '@/shared/components/ConceptCard'
import { ResultMetric } from '@/shared/components/ResultMetric'
import { resultsStorage } from '@/storage/resultsStorage'
import { misinformationScenarios } from '@/experiments/false-memory/falseMemory.data'
import type { FalseMemoryResult } from './falseMemory.types'

interface Props {
  result: FalseMemoryResult
  onRetry: () => void
  onHome: () => void
}

const TENDENCY_CLASSES = {
  Low: 'bg-green-100 text-green-800 border-green-300',
  Moderate: 'bg-amber-100 text-amber-800 border-amber-300',
  High: 'bg-red-100 text-red-800 border-red-300',
} as const

const MECHANISM_TEXT = {
  Endogenous:
    'Your false memories were primarily driven by internally generated semantic associations — the classic DRM effect. Your brain spread activation through a semantic network, making strongly related words feel as though they had genuinely been studied. This pattern is associated with the spontaneous-inference view of false memory.',
  Exogenous:
    "Your false memories were primarily driven by externally introduced post-event information — the misinformation effect. You were susceptible to suggestion embedded in follow-up questions, a pattern consistent with Loftus's research on how eyewitness memory is overwritten by later input.",
  Both: 'You showed susceptibility to both internally generated semantic associations and externally introduced misinformation. This is the most common finding: most people are vulnerable to both the DRM and misinformation effects, reflecting the fundamentally reconstructive nature of human memory.',
} as const

export function FalseMemoryResults({ result, onRetry, onHome }: Props) {
  // Ref guard prevents double-save in React 18 strict-mode double-effect invocations
  const savedRef = useRef(false)
  useEffect(() => {
    if (savedRef.current) return
    savedRef.current = true
    resultsStorage.save({
      id: crypto.randomUUID(),
      experimentId: 'false-memory',
      completedAt: new Date().toISOString(),
      durationMs: result.drm.durationMs + result.misinformation.durationMs,
      data: result,
    })
  }, [result])

  // Look up full scenario data to display question text for caught questions
  const scenario = misinformationScenarios.find(
    (s) => s.id === result.misinformation.scenarioId,
  )
  const misleadingOnly = scenario?.misleadingQuestions.filter((q) => q.type === 'misleading') ?? []
  const misleadingIdSet = new Set(misleadingOnly.map((q) => q.id))
  const misleadingResponses = result.misinformation.questionResponses.filter((r) =>
    misleadingIdSet.has(r.questionId),
  )
  const misleadedCount = misleadingResponses.filter((r) => r.wasMisled).length
  const caughtQuestions = misleadingOnly.filter((q) => {
    const resp = result.misinformation.questionResponses.find((r) => r.questionId === q.id)
    return resp?.wasMisled === true
  })

  const combinedScore = Math.round(result.combinedScore)
  const drmScore = Math.round(result.drm.drmFalseMemoryScore)
  const misScore = Math.round(result.misinformation.misinformationScore)

  const drmChartData = [
    { name: 'Correct', value: result.drm.correctRecognitions, fill: '#4f46e5' },
    { name: 'False', value: result.drm.falseRecognitions, fill: '#ef4444' },
  ]

  const misChartData = [
    { name: 'Misled', value: misleadedCount, fill: '#f59e0b' },
    { name: 'Resisted', value: misleadingResponses.length - misleadedCount, fill: '#10b981' },
  ]

  return (
    <div data-testid="results-page" className="space-y-10 pb-8">

      {/* ── Section 1: Profile ─────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Your Memory Profile</h2>

        <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center">
          <span
            data-testid="tendency-badge"
            className={`rounded-full border-2 px-8 py-3 text-xl font-bold ${TENDENCY_CLASSES[result.overallFalseMemoryTendency]}`}
          >
            {result.overallFalseMemoryTendency} False Memory Tendency
          </span>

          <p className="text-sm text-gray-500">
            Dominant mechanism:{' '}
            <span className="font-semibold text-gray-900">{result.dominantMechanism}</span>
          </p>

          <div className="w-full max-w-sm space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Combined score</span>
              <span className="font-semibold text-gray-900 tabular-nums">{combinedScore} / 100</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                data-testid="combined-score-meter"
                className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                style={{ width: `${combinedScore}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: DRM ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Test 1: Word Association Memory (DRM)</h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ResultMetric label="Correct recognitions" value={result.drm.correctRecognitions} />
          <ResultMetric label="False recognitions" value={result.drm.falseRecognitions} />
          <ResultMetric
            label="Lure hit rate"
            value={`${Math.round(result.drm.lureHitRate * 100)}%`}
          />
          <div data-testid="drm-score-display">
            <ResultMetric label="DRM score" value={drmScore} highlight={drmScore > 50} />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Recognition breakdown
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={drmChartData}
              aria-label="Bar chart comparing correct vs false recognitions in the DRM task"
              role="img"
            >
              <title>DRM recognition results — correct vs false</title>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                label={{ value: 'Words', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11 } }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                {drmChartData.map((entry, i) => (
                  <Cell key={`drm-${i}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {result.drm.luresSelected.length > 0 ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-amber-800">Lure words you selected</h3>
            <ul className="space-y-3">
              {result.drm.luresSelected.map((word) => (
                <li key={word} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 rounded-full bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-900">
                    {word}
                  </span>
                  <span className="text-sm text-amber-800">
                    &ldquo;{word}&rdquo; was never shown, but it is semantically central to the
                    list you studied. Spreading activation in your memory network pre-activated this
                    word, making it feel just as encoded as words you actually saw.
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-700">
              You did not select any lure words. Strong source-monitoring — correctly distinguishing
              studied items from merely associated items — is relatively uncommon on the DRM task.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <ConceptCard
            title="The DRM paradigm"
            body="The Deese-Roediger-McDermott (DRM) paradigm demonstrates false memory by presenting lists of words all strongly associated with a single critical lure word that is never shown. Participants routinely 'recognise' the lure at rates approaching studied words, because spreading activation in the brain's semantic network pre-activates the lure during encoding, making it feel indistinguishable from words that were genuinely presented."
          />
          <ConceptCard
            title="Reconstructive memory"
            body="Frederic Bartlett (1932) established that memory is not passive recording but active reconstruction. Each time we recall something we rebuild the episode using stored schemas and inferences, filling gaps with what 'should' have been there. This makes memory efficient and adaptive, but it also introduces systematic errors whenever gist-level associations diverge from specific studied details — precisely the condition that produces DRM false memories."
          />
        </div>
      </section>

      {/* ── Section 3: Misinformation ───────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Test 2: Post-Event Suggestion</h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ResultMetric
            label="Questions misled"
            value={`${misleadedCount} / ${misleadingResponses.length}`}
          />
          <ResultMetric
            label="Planted details accepted"
            value={result.misinformation.plantedItemsRecognized}
          />
          <div data-testid="mis-score-display">
            <ResultMetric
              label="Misinformation score"
              value={misScore}
              highlight={misScore > 50}
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Question susceptibility
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={misChartData}
              aria-label="Bar chart showing how many misleading questions the participant accepted vs resisted"
              role="img"
            >
              <title>Misinformation effect — misled vs resisted questions</title>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                label={{ value: 'Questions', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11 } }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                {misChartData.map((entry, i) => (
                  <Cell key={`mis-${i}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {caughtQuestions.length > 0 ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-amber-800">
              Misleading questions that shaped your recall
            </h3>
            <ul className="space-y-4 divide-y divide-amber-200">
              {caughtQuestions.map((q) => (
                <li key={q.id} className="pt-3 first:pt-0 space-y-1">
                  <p className="text-sm font-medium text-amber-900">{q.questionText}</p>
                  {q.plantedDetail !== null && (
                    <p className="text-xs text-amber-700">
                      Planted detail introduced:{' '}
                      <em className="font-medium">&ldquo;{q.plantedDetail}&rdquo;</em>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-700">
              None of the misleading follow-up questions altered your memory — your recall was
              resistant to post-event suggestion on this scenario.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <ConceptCard
            title="The misinformation effect"
            body="Elizabeth Loftus and John Palmer (1974) showed that post-event questions can rewrite eyewitness memory. Participants asked how fast cars were going when they 'smashed' reported higher speeds and falsely recalled broken glass — a detail never shown. The misleading word in the question was incorporated into the original memory trace, demonstrating that memories are not stable recordings but are vulnerable to contamination by later information."
          />
          <ConceptCard
            title="Memory malleability"
            body="Memory retrieval is not a read-only operation. During reconsolidation — the brief period after a memory is reactivated — it enters a labile state in which new information can be incorporated and stored back. This means every act of recall is also an opportunity for the memory to change. The legal implications are significant: eyewitness testimony is unreliable when contaminated by post-event questioning, media coverage, or discussion with other witnesses before a formal statement is taken."
          />
        </div>
      </section>

      {/* ── Section 4: What this means ─────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">What this means for you</h2>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm leading-relaxed text-gray-700">
            {MECHANISM_TEXT[result.dominantMechanism]}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            data-testid="retry-btn"
            onClick={onRetry}
            className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Try again
          </button>
          <button
            type="button"
            data-testid="home-btn"
            onClick={onHome}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Back to experiments
          </button>
        </div>
      </section>
    </div>
  )
}
