import type { ProspectScenario } from '@/experiments/decision-making/decisionMaking.types'

interface Props {
  scenario: ProspectScenario
  currentIndex: number
  total: number
  onAnswer: (choice: 'A' | 'B') => void
}

const CATEGORY_LABELS: Record<ProspectScenario['category'], string> = {
  gain: 'Gain scenario',
  loss: 'Loss scenario',
  temporal: 'Time scenario',
}

const CATEGORY_CLASSES: Record<ProspectScenario['category'], string> = {
  gain: 'bg-green-100 text-green-800',
  loss: 'bg-red-100 text-red-800',
  temporal: 'bg-blue-100 text-blue-800',
}

export function ProspectScenarioPhase({ scenario, currentIndex, total, onAnswer }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_CLASSES[scenario.category]}`}
        >
          {CATEGORY_LABELS[scenario.category]}
        </span>
        <span className="text-sm text-gray-400 tabular-nums">
          {currentIndex + 1} / {total}
        </span>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p
          data-testid="prospect-question"
          className="text-lg font-semibold text-gray-900 leading-snug"
        >
          {scenario.question}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          data-testid="prospect-option-a"
          onClick={() => onAnswer('A')}
          className="group rounded-xl border-2 border-gray-200 bg-white p-6 text-left space-y-2 hover:border-indigo-400 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 group-hover:bg-indigo-200">
            Option A
          </span>
          <p className="text-base font-medium text-gray-900 leading-snug">
            {scenario.optionA.description}
          </p>
        </button>

        <button
          type="button"
          data-testid="prospect-option-b"
          onClick={() => onAnswer('B')}
          className="group rounded-xl border-2 border-gray-200 bg-white p-6 text-left space-y-2 hover:border-indigo-400 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 group-hover:bg-indigo-200">
            Option B
          </span>
          <p className="text-base font-medium text-gray-900 leading-snug">
            {scenario.optionB.description}
          </p>
        </button>
      </div>

      <p className="text-center text-xs text-gray-400">
        Tap the option you would genuinely choose
      </p>
    </div>
  )
}
