import type { GambleChoice, GambleOption } from '@/experiments/decision-making/decisionMaking.types'

interface Props {
  gamble: GambleChoice
  currentIndex: number
  total: number
  onAnswer: (choice: 'A' | 'B') => void
}

interface OptionCardProps {
  label: string
  option: GambleOption
  testId: string
  onClick: () => void
}

function OptionCard({ label, option, testId, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      className="group rounded-xl border-2 border-gray-200 bg-white p-5 text-left space-y-3 hover:border-indigo-400 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors w-full"
    >
      <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 group-hover:bg-indigo-200">
        {label}
      </span>

      <p className="text-sm font-medium text-gray-800 leading-snug">{option.description}</p>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-green-50 border border-green-200 p-2 text-center">
          <p className="text-green-700 font-semibold">Win</p>
          <p className="text-green-900 font-bold">${option.winAmount}</p>
          <p className="text-green-600">{Math.round(option.winProbability * 100)}% chance</p>
        </div>
        <div className="rounded-lg bg-red-50 border border-red-200 p-2 text-center">
          <p className="text-red-700 font-semibold">Lose</p>
          <p className="text-red-900 font-bold">${option.loseAmount}</p>
          <p className="text-red-600">{Math.round(option.loseProbability * 100)}% chance</p>
        </div>
      </div>

      <div className="text-xs text-gray-400 text-right">
        Expected value: <span className={`font-semibold ${option.expectedValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>${option.expectedValue}</span>
      </div>
    </button>
  )
}

export function GamblePhase({ gamble, currentIndex, total, onAnswer }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Gamble choice</p>
        <span className="text-sm text-gray-400 tabular-nums">
          {currentIndex + 1} / {total}
        </span>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p
          data-testid="gamble-question"
          className="text-lg font-semibold text-gray-900"
        >
          {gamble.question}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <OptionCard
          label="Option A"
          option={gamble.optionA}
          testId="gamble-option-a"
          onClick={() => onAnswer('A')}
        />
        <OptionCard
          label="Option B"
          option={gamble.optionB}
          testId="gamble-option-b"
          onClick={() => onAnswer('B')}
        />
      </div>

      <p className="text-center text-xs text-gray-400">
        Choose the gamble you would genuinely play if outcomes were real
      </p>
    </div>
  )
}
