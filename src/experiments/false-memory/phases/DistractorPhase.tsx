import { useState } from 'react'

interface Problem {
  a: number
  b: number
}

interface DistractorPhaseProps {
  onComplete: () => void
}

export function DistractorPhase({ onComplete }: DistractorPhaseProps) {
  const [problems] = useState<Problem[]>(() =>
    Array.from({ length: 3 }, () => ({
      a: Math.floor(Math.random() * 20) + 10,
      b: Math.floor(Math.random() * 20) + 10,
    })),
  )

  const [answers, setAnswers] = useState<string[]>(['', '', ''])

  const allCorrect = problems.every((prob, i) => {
    const ans = answers[i]
    return ans !== undefined && parseInt(ans, 10) === prob.a + prob.b
  })

  function handleChange(index: number, value: string) {
    setAnswers((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Quick distraction task</h2>
        <p className="mt-1 text-gray-500">
          Solve all three problems to clear your working memory before the recall test.
        </p>
      </div>

      <div className="space-y-4">
        {problems.map((prob, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-lg bg-white border border-gray-200 px-5 py-4"
          >
            <span className="text-lg font-medium text-gray-700 min-w-[120px]">
              {prob.a} + {prob.b} =
            </span>
            <input
              type="number"
              data-testid={`distractor-input-${i}`}
              value={answers[i] ?? ''}
              onChange={(e) => handleChange(i, e.target.value)}
              className="w-24 rounded-md border border-gray-300 px-3 py-2 text-center text-lg focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="?"
            />
            {answers[i] !== '' && (
              <span className="text-lg">
                {parseInt(answers[i] ?? '', 10) === prob.a + prob.b ? '✓' : '✗'}
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onComplete}
        disabled={!allCorrect}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue to Recall
      </button>
    </div>
  )
}
