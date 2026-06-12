interface Props {
  onStart: () => void
}

export function IntroPhase({ onStart }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">False Memory Lab</h2>
        <p className="mt-2 text-sm font-medium text-indigo-600 uppercase tracking-wide">
          Cognitive Science Experiment
        </p>
      </div>

      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          This experiment investigates how memories form and how they can become distorted — even
          without any intent to deceive. You will complete two tasks totalling approximately
          12–15 minutes. The first asks you to study word lists and later recall them; the second
          presents a short incident report followed by questions and a recognition test.
        </p>
        <p>
          There are no trick questions and no right or wrong answers — only your genuine responses
          matter. <strong className="text-gray-900">Please respond naturally</strong> and do not
          try to memorise artificially or second-guess the task. The quality of the science depends
          on honest, unguarded responses.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500 space-y-1">
        <p>• Two tasks · ~12–15 minutes total</p>
        <p>• No time pressure on reading tasks</p>
        <p>• You may exit at any time</p>
      </div>

      <button
        type="button"
        data-testid="intro-start-btn"
        onClick={onStart}
        className="w-full rounded-lg bg-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
      >
        Begin experiment
      </button>
    </div>
  )
}
