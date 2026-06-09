import { useState } from 'react'

interface RecallPhaseProps {
  options: string[]
  selectedWords: Set<string>
  onToggle: (word: string) => void
  onComplete: (confidence: number) => void
}

const LABELS: Record<number, string> = {
  1: 'Guessing',
  2: 'Unsure',
  3: 'Somewhat confident',
  4: 'Confident',
  5: 'Very confident',
}

export function RecallPhase({
  options,
  selectedWords,
  onToggle,
  onComplete,
}: RecallPhaseProps) {
  const [confidence, setConfidence] = useState(3)
  const [hasRated, setHasRated] = useState(false)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Recall the words</h2>
        <p className="mt-1 text-gray-500">
          Select every word you remember seeing in the study list.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {options.map((word) => {
          const checked = selectedWords.has(word)
          return (
            <button
              key={word}
              type="button"
              data-testid={`recall-option-${word}`}
              onClick={() => onToggle(word)}
              aria-pressed={checked}
              className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                checked
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {word}
            </button>
          )
        })}
      </div>

      <div className="rounded-lg bg-white border border-gray-200 p-5 space-y-3">
        <label
          htmlFor="confidence-slider"
          className="block text-sm font-medium text-gray-700"
        >
          How confident are you in your memory?
        </label>
        <input
          id="confidence-slider"
          type="range"
          min={1}
          max={5}
          step={1}
          value={confidence}
          data-testid="confidence-slider"
          onChange={(e) => {
            setConfidence(Number(e.target.value))
            setHasRated(true)
          }}
          className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Guessing</span>
          <span className="font-medium text-indigo-600">
            {hasRated ? (LABELS[confidence] ?? '') : 'Move slider to rate'}
          </span>
          <span>Very confident</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onComplete(confidence)}
        disabled={!hasRated}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Submit
      </button>
    </div>
  )
}
