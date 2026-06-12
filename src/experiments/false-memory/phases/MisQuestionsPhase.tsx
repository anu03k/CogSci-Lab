import { useState } from 'react'
import type { MisinformationQuestion } from '@/experiments/false-memory/falseMemory.types'

interface Props {
  questions: MisinformationQuestion[]
  responses: Record<string, string>
  onAnswer: (questionId: string, answer: string) => void
  onComplete: () => void
}

export function MisQuestionsPhase({ questions, responses, onAnswer, onComplete }: Props) {
  const [localIndex, setLocalIndex] = useState(0)

  const question = questions[localIndex]
  if (!question) return null

  const selectedAnswer = responses[question.id]
  const hasSelection = selectedAnswer !== undefined

  const handleNext = () => {
    if (localIndex < questions.length - 1) {
      setLocalIndex((i) => i + 1)
    } else {
      onComplete()
    }
  }

  const isLastQuestion = localIndex === questions.length - 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Follow-up Questions</h2>
        <span className="text-sm text-gray-400 tabular-nums">
          {localIndex + 1} / {questions.length}
        </span>
      </div>

      <div
        data-testid={`mis-question-${question.id}`}
        className="rounded-xl border border-gray-200 bg-white p-5 space-y-4"
      >
        <p className="text-base font-medium text-gray-900">{question.questionText}</p>

        <fieldset className="space-y-2">
          <legend className="sr-only">Select an answer</legend>
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option
            return (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                  isSelected
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  data-testid={`mis-option-${question.id}-${option}`}
                  name={`question-${question.id}`}
                  value={option}
                  checked={isSelected}
                  onChange={() => onAnswer(question.id, option)}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium">{option}</span>
              </label>
            )
          })}
        </fieldset>
      </div>

      <button
        type="button"
        data-testid="mis-next-btn"
        disabled={!hasSelection}
        onClick={handleNext}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
      >
        {isLastQuestion ? 'Finish questions' : 'Next question'}
      </button>
    </div>
  )
}
