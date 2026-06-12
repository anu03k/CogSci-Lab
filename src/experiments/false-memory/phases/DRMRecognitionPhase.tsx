interface Props {
  options: string[]
  selected: Set<string>
  onToggle: (word: string) => void
  onComplete: () => void
}

export function DRMRecognitionPhase({ options, selected, onToggle, onComplete }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Recognition Test</h2>
        <p className="mt-1 text-gray-500">
          Check every word you are <strong className="text-gray-800">CERTAIN</strong> appeared in
          the lists. Only select words you are confident about.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {options.map((word) => {
          const isChecked = selected.has(word)
          return (
            <label
              key={word}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
                isChecked
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-800'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                data-testid={`recognition-checkbox-${word}`}
                checked={isChecked}
                onChange={() => onToggle(word)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>{word}</span>
            </label>
          )
        })}
      </div>

      <button
        type="button"
        data-testid="recognition-submit-btn"
        onClick={onComplete}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
      >
        Submit recognition test
      </button>
    </div>
  )
}
