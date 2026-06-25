interface Props {
  onStart: () => void
}

export function IntroPhase({ onStart }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Anchoring Bias Lab</h2>
        <p className="mt-2 text-sm font-medium text-indigo-600 uppercase tracking-wide">
          Cognitive Science Experiment
        </p>
      </div>

      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          <strong className="text-gray-900">Test 1 — Classic Anchoring:</strong> You will see a
          comparison question that mentions a specific number, then estimate an unknown quantity.
          You will complete this twice with different anchor numbers, revealing how those numbers
          shift your estimates.
        </p>
        <p>
          <strong className="text-gray-900">Test 2 — Wheel of Fortune:</strong> You will spin a
          wheel that lands on a random number, then estimate an unrelated quantity. Research shows
          even obviously irrelevant numbers unconsciously bias our guesses.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500 space-y-1">
        <p>• Two tasks · ~8 minutes total</p>
        <p>• Answer with your first instinct — do not look answers up</p>
        <p>• You may exit at any time</p>
      </div>

      <button
        type="button"
        data-testid="anchoring-intro-start-btn"
        onClick={onStart}
        className="w-full rounded-lg bg-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
      >
        Begin experiment
      </button>
    </div>
  )
}
