interface Props {
  onStart: () => void
}

export function RiskIntroPhase({ onStart }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Part 2: Gamble Choices</h2>
        <p className="mt-2 text-sm font-medium text-indigo-600 uppercase tracking-wide">
          Risk Assessment
        </p>
      </div>

      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          In this task you will see five pairs of gambles. Each gamble shows the exact
          probabilities and dollar amounts involved — nothing is hidden.
        </p>
        <p>
          For each pair, pick the gamble you would genuinely choose to play if the outcomes
          were real. There is no time pressure; take a moment to consider each option carefully.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500 space-y-1">
        <p>• 5 gamble pairs</p>
        <p>• Full odds and amounts shown for every option</p>
        <p>• ~3 minutes</p>
      </div>

      <button
        type="button"
        data-testid="risk-intro-start-btn"
        onClick={onStart}
        className="w-full rounded-lg bg-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
      >
        Start gamble task
      </button>
    </div>
  )
}
