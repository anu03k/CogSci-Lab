import type { ProspectResult } from '@/experiments/decision-making/decisionMaking.types'

interface Props {
  prospectResult: ProspectResult
  onContinue: () => void
}

const PATTERN_LABELS: Record<ProspectResult['dominantPattern'], string> = {
  'loss-averse': 'Loss Averse',
  'risk-seeking': 'Risk Seeking',
  'rational': 'Rational',
  'mixed': 'Mixed',
}

const PATTERN_CLASSES: Record<ProspectResult['dominantPattern'], string> = {
  'loss-averse': 'bg-red-100 text-red-800 border-red-300',
  'risk-seeking': 'bg-orange-100 text-orange-800 border-orange-300',
  'rational': 'bg-green-100 text-green-800 border-green-300',
  'mixed': 'bg-gray-100 text-gray-800 border-gray-300',
}

export function ProspectMiniResultPhase({ prospectResult, onContinue }: Props) {
  const consistency = Math.round(prospectResult.consistencyScore)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Prospect Theory Complete</h2>
        <p className="mt-1 text-gray-500">
          Here is how your choices compare to rational expected-value decisions.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 text-center">
        <span
          data-testid="dm-pattern-badge"
          className={`rounded-full border-2 px-6 py-2 text-lg font-bold ${PATTERN_CLASSES[prospectResult.dominantPattern]}`}
        >
          {PATTERN_LABELS[prospectResult.dominantPattern]}
        </span>
        <p className="text-sm text-gray-500">Your dominant decision pattern</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Rational choices
          </p>
          <p
            data-testid="dm-rational-count"
            className="text-3xl font-bold text-gray-900"
          >
            {prospectResult.rationalChoices}
            <span className="text-lg text-gray-400"> / {prospectResult.totalScenarios}</span>
          </p>
          <p className="text-xs text-gray-500">Maximised expected value</p>
        </div>

        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
            Psychological choices
          </p>
          <p
            data-testid="dm-psychological-count"
            className="text-3xl font-bold text-gray-900"
          >
            {prospectResult.psychologicalChoices}
            <span className="text-lg text-gray-400"> / {prospectResult.totalScenarios}</span>
          </p>
          <p className="text-xs text-gray-500">Driven by cognitive bias</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-gray-600">Rationality score</span>
            <span
              data-testid="dm-consistency-score"
              className="text-sm font-bold text-gray-900"
            >
              {consistency} / 100
            </span>
          </div>
          <div
            data-testid="dm-consistency-meter"
            className="h-3 w-full overflow-hidden rounded-full bg-gray-100"
          >
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-700"
              style={{ width: `${consistency}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-400">
            Percentage of scenarios where you chose the expected-value-maximising option.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
            <p className="font-semibold text-gray-700">Loss aversion</p>
            <p className={`mt-1 font-bold ${prospectResult.lossAversionEvidence ? 'text-red-600' : 'text-green-600'}`}>
              {prospectResult.lossAversionEvidence ? 'Detected' : 'Not detected'}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
            <p className="font-semibold text-gray-700">Gain seeking</p>
            <p className={`mt-1 font-bold ${prospectResult.gainSeeking ? 'text-orange-600' : 'text-green-600'}`}>
              {prospectResult.gainSeeking ? 'Detected' : 'Not detected'}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
            <p className="font-semibold text-gray-700">Present bias</p>
            <p className={`mt-1 font-bold ${prospectResult.temporalDiscounting ? 'text-orange-600' : 'text-green-600'}`}>
              {prospectResult.temporalDiscounting ? 'Detected' : 'Not detected'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Now we test your <strong>risk tolerance</strong> directly — you will evaluate five real
        gambles with explicit probabilities and payouts.
      </div>

      <button
        type="button"
        data-testid="dm-mini-continue-btn"
        onClick={onContinue}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
      >
        Continue to Risk Profile
      </button>
    </div>
  )
}
