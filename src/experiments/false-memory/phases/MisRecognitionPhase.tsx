import type { RecognitionItem } from '@/experiments/false-memory/falseMemory.types'

interface Props {
  items: RecognitionItem[]
  selections: Set<string>
  onToggle: (itemId: string) => void
  onComplete: () => void
}

export function MisRecognitionPhase({ items, selections, onToggle, onComplete }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Recognition Test</h2>
        <p className="mt-1 text-gray-500">
          Which of the following did you observe in the incident? Select everything you are
          confident you encountered.
        </p>
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const isChecked = selections.has(item.id)
          return (
            <label
              key={item.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                isChecked
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                data-testid={`mis-recognition-${item.id}`}
                checked={isChecked}
                onChange={() => onToggle(item.id)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium">{item.text}</span>
            </label>
          )
        })}
      </div>

      <button
        type="button"
        data-testid="mis-recognition-submit-btn"
        onClick={onComplete}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
      >
        Submit recognition test
      </button>
    </div>
  )
}
