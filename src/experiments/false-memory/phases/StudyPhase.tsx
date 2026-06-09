import { useTimer } from '@/shared/hooks/useTimer'

interface StudyPhaseProps {
  words: string[]
  onComplete: () => void
}

export function StudyPhase({ words, onComplete }: StudyPhaseProps) {
  const { remaining } = useTimer(15, onComplete)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Study these words</h2>
        <p className="mt-1 text-gray-500">
          Memorize as many as you can. You have{' '}
          <span
            className={`font-semibold ${remaining <= 5 ? 'text-red-600' : 'text-indigo-600'}`}
          >
            {remaining}s
          </span>{' '}
          remaining.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {words.map((word) => (
          <div
            key={word}
            data-testid={`study-word-${word}`}
            className="flex items-center justify-center rounded-lg bg-white border border-gray-200 py-4 text-lg font-medium text-gray-800 shadow-sm"
          >
            {word}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onComplete}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        I&apos;ve memorized these
      </button>
    </div>
  )
}
