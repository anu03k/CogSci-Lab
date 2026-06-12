import { useState } from 'react'
import { useTimer } from '@/shared/hooks/useTimer'
import type { MisinformationScenario } from '@/experiments/false-memory/falseMemory.types'

interface Props {
  scenario: MisinformationScenario
  onComplete: () => void
}

export function MisNarrativePhase({ scenario, onComplete }: Props) {
  const [canContinue, setCanContinue] = useState(false)
  const { remaining } = useTimer(60, () => setCanContinue(true))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{scenario.title}</h2>
        <p className="mt-1 text-sm text-gray-500">Incident report — read carefully.</p>
      </div>

      <div className="rounded-xl border border-gray-300 bg-stone-50 px-6 py-5 shadow-sm">
        <p
          data-testid="narrative-text"
          className="text-base leading-8 text-gray-800 font-serif"
        >
          {scenario.narrativeText}
        </p>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2">
        <span className="text-sm text-gray-500">
          {canContinue ? 'Minimum reading time reached' : 'Please keep reading…'}
        </span>
        {!canContinue && (
          <span
            data-testid="narrative-timer"
            className="text-lg font-bold tabular-nums text-indigo-600"
          >
            {remaining}s
          </span>
        )}
        {canContinue && (
          <span data-testid="narrative-timer" className="text-sm font-medium text-green-600">
            Ready
          </span>
        )}
      </div>

      <button
        type="button"
        data-testid="narrative-continue-btn"
        disabled={!canContinue}
        onClick={onComplete}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
      >
        I have read this carefully
      </button>
    </div>
  )
}
