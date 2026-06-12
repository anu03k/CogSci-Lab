import type { DRMResult } from '@/experiments/false-memory/falseMemory.types'

interface Props {
  drmResult: DRMResult
  onContinue: () => void
}

export function DRMMiniResultPhase({ drmResult, onContinue }: Props) {
  const score = Math.round(drmResult.drmFalseMemoryScore)
  const luresSelected = drmResult.luresSelected

  return (
    <div data-testid="drm-mini-result" className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Part 1 Complete</h2>
        <p className="mt-1 text-gray-500">Here is a brief snapshot of your word-memory results.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Critical lure words you selected
        </h3>
        <div data-testid="drm-lure-list" className="flex flex-wrap gap-2 min-h-8">
          {luresSelected.length === 0 ? (
            <span className="text-sm text-gray-400 italic">None selected</span>
          ) : (
            luresSelected.map((word) => (
              <span
                key={word}
                className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 ring-1 ring-amber-300"
              >
                {word}
              </span>
            ))
          )}
        </div>
        <p className="text-xs text-gray-400">
          These words were never in the lists — they were semantically related to what you studied.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            DRM false-memory score
          </h3>
          <span className="text-lg font-bold text-gray-900">{score} / 100</span>
        </div>
        <div
          data-testid="drm-score-meter"
          className="h-3 w-full overflow-hidden rounded-full bg-gray-100"
        >
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-700"
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-xs text-gray-400">
          Reflects how often you selected unshown lure words and other non-studied items.
        </p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Your memory may have been shaped by <strong>association</strong> — words that fit a theme
        can feel just as real as words you actually saw. Now we test a different mechanism —
        external suggestion.
      </div>

      <button
        type="button"
        data-testid="drm-continue-btn"
        onClick={onContinue}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
      >
        Continue to Part 2
      </button>
    </div>
  )
}
