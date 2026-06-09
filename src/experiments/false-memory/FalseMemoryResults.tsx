import { useEffect } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ConceptCard } from '@/shared/components/ConceptCard'
import { ResultMetric } from '@/shared/components/ResultMetric'
import { resultsStorage } from '@/storage/resultsStorage'
import type { FalseMemoryResult } from './falseMemory.types'

interface FalseMemoryResultsProps {
  result: FalseMemoryResult
  onRetry: () => void
  onHome: () => void
}

const chartData = (result: FalseMemoryResult) => [
  { name: 'Correct recalls', value: result.correctRecalls, fill: '#4f46e5' },
  { name: 'False recalls', value: result.falseRecalls, fill: '#ef4444' },
]

export function FalseMemoryResults({
  result,
  onRetry,
  onHome,
}: FalseMemoryResultsProps) {
  useEffect(() => {
    resultsStorage.save({
      id: crypto.randomUUID(),
      experimentId: 'false-memory',
      completedAt: new Date().toISOString(),
      durationMs: result.durationMs,
      data: result,
    })
    // Intentionally run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      data-testid="results-page"
      className="min-h-screen bg-gray-50 py-10 px-4"
    >
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Results</h1>
          <p className="mt-1 text-gray-500">
            False Memory Experiment · {result.wordListId} list
          </p>
        </div>

        {/* Lure indicator */}
        <div
          data-testid="lure-selected-indicator"
          className={`rounded-xl p-5 border-2 ${
            result.lureSelected
              ? 'bg-red-50 border-red-400'
              : 'bg-green-50 border-green-400'
          }`}
        >
          <p
            className={`text-lg font-semibold ${
              result.lureSelected ? 'text-red-700' : 'text-green-700'
            }`}
          >
            {result.lureSelected
              ? '⚠ You formed a false memory'
              : '✓ You avoided the lure'}
          </p>
          <p
            className={`mt-1 text-sm ${
              result.lureSelected ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {result.lureSelected
              ? `You recalled "${result.lureWord}" — a word that was never shown. This is a classic DRM false memory.`
              : `You correctly did not recall "${result.lureWord}", which was never in the study list.`}
          </p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ResultMetric
            label="Correct recalls"
            value={result.correctRecalls}
            highlight
          />
          <ResultMetric label="False recalls" value={result.falseRecalls} />
          <ResultMetric
            label="Accuracy"
            value={`${result.accuracyPct}%`}
            highlight={result.accuracyPct >= 50}
          />
          <ResultMetric
            label="Lure selected"
            value={result.lureSelected ? 'Yes' : 'No'}
          />
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
            Recalls breakdown
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={chartData(result)}
              aria-label="Bar chart comparing correct vs false recalls"
              role="img"
            >
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData(result).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Concept cards */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">
            What just happened?
          </h2>
          <ConceptCard
            title="False Memory"
            body="False memories are recollections of events that never occurred. They arise not from deliberate deception but from the reconstructive nature of memory — each recall is an act of rebuilding, not replaying, and errors can be introduced in the process."
          />
          <ConceptCard
            title="DRM Paradigm"
            body="The Deese-Roediger-McDermott (DRM) paradigm demonstrates false memory by presenting lists of words all associated with a single lure word that is never shown. Participants frequently 'remember' the lure at rates approaching studied items, revealing how semantic networks drive memory errors."
          />
          <ConceptCard
            title="Memory Reconstruction"
            body="Rather than storing experiences like a video recording, the brain encodes patterns and schemas. Recall is a generative act: we fill gaps using knowledge, inference, and context — making memory adaptive but also susceptible to systematic distortions."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
          <button
            type="button"
            onClick={onHome}
            className="flex-1 bg-white text-gray-700 py-3 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Back to Experiments
          </button>
        </div>
      </div>
    </div>
  )
}
