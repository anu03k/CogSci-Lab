interface Props {
  onStart: () => void
}

export function IntroPhase({ onStart }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Decision Making Lab</h2>
        <p className="mt-2 text-sm font-medium text-indigo-600 uppercase tracking-wide">
          Cognitive Science Experiment
        </p>
      </div>

      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          <strong className="text-gray-900">Test 1 — Prospect Theory:</strong> You will face a
          series of choices between a guaranteed outcome and a risky gamble. These scenarios span
          gains, losses, and time — revealing how your brain values certainty differently depending
          on whether you stand to win or lose.
        </p>
        <p>
          <strong className="text-gray-900">Test 2 — Risk Profile:</strong> You will evaluate five
          real gambles, each with explicit odds and payouts. Your pattern of choices will map your
          personal risk tolerance and reveal whether you align with expected value reasoning.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500 space-y-1">
        <p>• Two tasks · ~10 minutes total</p>
        <p>• Choose with your gut — there are no right or wrong answers</p>
        <p>• You may exit at any time</p>
      </div>

      <button
        type="button"
        data-testid="dm-intro-start-btn"
        onClick={onStart}
        className="w-full rounded-lg bg-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
      >
        Begin experiment
      </button>
    </div>
  )
}
