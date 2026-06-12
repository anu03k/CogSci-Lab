interface Props {
  onStart: () => void
}

export function MisIntroPhase({ onStart }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Part 2: Incident Report</h2>
        <p className="mt-2 text-sm font-medium text-indigo-600 uppercase tracking-wide">
          Memory &amp; Observation
        </p>
      </div>

      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          You will read a brief written account of an incident. Afterwards you will answer a short
          series of follow-up questions about the details, then complete a recognition memory test.
        </p>
        <p>
          <strong className="text-gray-900">Read carefully.</strong> You will not be able to refer
          back to the account once you move on. Take as long as you need before pressing the button
          to confirm you have finished reading.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500 space-y-1">
        <p>• One short incident narrative</p>
        <p>• Six follow-up questions</p>
        <p>• Brief recognition test</p>
      </div>

      <button
        type="button"
        data-testid="mis-intro-start-btn"
        onClick={onStart}
        className="w-full rounded-lg bg-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
      >
        Read the incident report
      </button>
    </div>
  )
}
