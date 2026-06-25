interface Props {
  question: string
  anchorValue: number
  topic: string
  anchorType: 'high' | 'low'
  onAnswer: (response: 'older' | 'younger') => void
}

export function ClassicAnchorPhase({ question, anchorValue, topic, anchorType, onAnswer }: Props) {
  const pillClasses =
    anchorType === 'high'
      ? 'bg-red-100 text-red-800 ring-1 ring-red-200'
      : 'bg-blue-100 text-blue-800 ring-1 ring-blue-200'

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Topic</p>
        <p className="mt-1 text-base font-semibold text-gray-900">{topic}</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <p
          data-testid="anchor-question-text"
          className="text-xl font-semibold text-gray-900 leading-snug"
        >
          {question}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Anchor value:</span>
          <span
            data-testid="anchor-value-display"
            className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${pillClasses}`}
          >
            {anchorValue.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          data-testid="anchor-btn-older"
          onClick={() => onAnswer('older')}
          className="rounded-lg border-2 border-gray-200 bg-white px-6 py-5 text-lg font-semibold text-gray-900 hover:border-indigo-400 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          Older / Higher
        </button>
        <button
          type="button"
          data-testid="anchor-btn-younger"
          onClick={() => onAnswer('younger')}
          className="rounded-lg border-2 border-gray-200 bg-white px-6 py-5 text-lg font-semibold text-gray-900 hover:border-indigo-400 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          Younger / Lower
        </button>
      </div>
    </div>
  )
}
