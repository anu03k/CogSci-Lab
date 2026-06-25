interface Props {
  onStart: () => void
}

export function WheelIntroPhase({ onStart }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Part 2: Wheel of Fortune</h2>
        <p className="mt-2 text-sm font-medium text-indigo-600 uppercase tracking-wide">
          Estimation Task
        </p>
      </div>

      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          In this task you will first spin a wheel. The wheel will land on a number chosen at
          random. After seeing the result, you will be asked to estimate the answer to a factual
          question.
        </p>
        <p>
          The wheel result has <strong className="text-gray-900">nothing to do</strong> with the
          correct answer. Simply take note of the number it lands on, then give your best estimate
          to the question that follows.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500 space-y-1">
        <p>• Spin the wheel once</p>
        <p>• Answer one estimation question</p>
        <p>• ~2 minutes</p>
      </div>

      <button
        type="button"
        data-testid="wheel-intro-start-btn"
        onClick={onStart}
        className="w-full rounded-lg bg-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
      >
        Start wheel task
      </button>
    </div>
  )
}
