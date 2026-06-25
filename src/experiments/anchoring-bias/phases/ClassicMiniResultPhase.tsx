import type { ClassicResult } from '@/experiments/anchoring-bias/anchoring.types'

interface Props {
  classicResult: ClassicResult
  onContinue: () => void
}

export function ClassicMiniResultPhase({ classicResult, onContinue }: Props) {
  const score = Math.round(classicResult.anchorInfluenceScore)
  const delta = Math.abs(classicResult.anchorDelta)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Classic Test Complete</h2>
        <p className="mt-1 text-gray-500">
          Here is how the anchor numbers shifted your estimates.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
            High anchor: {classicResult.highAnchorValue.toLocaleString()}
          </p>
          <p
            data-testid="mini-result-estimate1"
            className="text-3xl font-bold text-gray-900"
          >
            {classicResult.estimate1.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Your estimate</p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Low anchor: {classicResult.lowAnchorValue.toLocaleString()}
          </p>
          <p
            data-testid="mini-result-estimate2"
            className="text-3xl font-bold text-gray-900"
          >
            {classicResult.estimate2.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Your estimate</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <p
          data-testid="mini-result-delta"
          className="text-center text-lg font-semibold text-gray-900"
        >
          Your estimates differed by{' '}
          <span className="text-indigo-600">{delta.toLocaleString()}</span>
        </p>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-gray-600">Anchor influence score</span>
            <span className="text-sm font-bold text-gray-900">{score} / 100</span>
          </div>
          <div
            data-testid="mini-result-score-meter"
            className="h-3 w-full overflow-hidden rounded-full bg-gray-100"
          >
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-700"
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-400">
            Reflects how much the anchor numbers moved your estimates relative to the anchor spread.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Now we test whether even a <strong>random number</strong> can anchor you — even when you
        know it is completely unrelated to the answer.
      </div>

      <button
        type="button"
        data-testid="mini-continue-btn"
        onClick={onContinue}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
      >
        Continue to Wheel of Fortune
      </button>
    </div>
  )
}
