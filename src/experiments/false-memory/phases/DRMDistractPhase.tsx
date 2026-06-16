import { useEffect, useRef, useState } from 'react'
import { useTimer } from '@/shared/hooks/useTimer'

interface Problem {
  a: number
  b: number
  answer: number
}

interface Props {
  onComplete: () => void
}

export function DRMDistractPhase({ onComplete }: Props) {
  const doneRef = useRef(false)

  const handleDone = () => {
    if (!doneRef.current) {
      doneRef.current = true
      onComplete()
    }
  }

  const [problems] = useState<Problem[]>(() =>
    Array.from({ length: 5 }, () => {
      const a = 10 + Math.floor(Math.random() * 90)
      const b = 10 + Math.floor(Math.random() * 90)
      return { a, b, answer: a + b }
    }),
  )

  const [values, setValues] = useState<string[]>(['', '', '', '', ''])
  const [locked, setLocked] = useState<boolean[]>([false, false, false, false, false])
  const [errors, setErrors] = useState<boolean[]>([false, false, false, false, false])
  const inputRefs = useRef<Array<HTMLInputElement | null>>([null, null, null, null, null])

  const { remaining } = useTimer(60, handleDone)

  // Fire onComplete when all five are locked
  useEffect(() => {
    if (locked.every(Boolean)) handleDone()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked])

  const handleChange = (i: number, raw: string) => {
    if (locked[i]) return

    const nextValues = values.map((v, idx) => (idx === i ? raw : v))
    setValues(nextValues)

    const prob = problems[i]
    if (!prob) return

    const parsed = parseInt(raw, 10)
    const correct = !isNaN(parsed) && parsed === prob.answer

    if (correct) {
      const nextLocked = locked.map((l, idx) => (idx === i ? true : l))
      setLocked(nextLocked)
      setErrors((prev) => prev.map((e, idx) => (idx === i ? false : e)))
      // Move focus to next unlocked input
      for (let j = i + 1; j < 5; j++) {
        if (!nextLocked[j]) {
          setTimeout(() => inputRefs.current[j]?.focus(), 0)
          break
        }
      }
    } else if (raw.length >= 2) {
      setErrors((prev) => prev.map((e, idx) => (idx === i ? true : e)))
    } else {
      setErrors((prev) => prev.map((e, idx) => (idx === i ? false : e)))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Quick Maths Break</h2>
        <p className="mt-1 text-gray-500">Solve all five problems to continue.</p>
      </div>

      <div className="flex items-center justify-center">
        <span
          data-testid="distract-timer"
          className={`text-3xl font-bold tabular-nums ${
            remaining <= 10 ? 'text-red-600' : 'text-indigo-600'
          }`}
        >
          {remaining}s
        </span>
      </div>

      <div className="space-y-3">
        {problems.map((prob, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3">
            <span className="w-28 text-lg font-mono font-medium text-gray-700">
              {prob.a} + {prob.b} =
            </span>
            <input
              ref={(el) => {
                inputRefs.current[i] = el
              }}
              data-testid={`distract-input-${i}`}
              type="number"
              inputMode="numeric"
              value={values[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              disabled={locked[i]}
              className={`w-24 rounded-lg border px-3 py-2 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                locked[i]
                  ? 'border-green-400 bg-green-50 text-green-700 cursor-not-allowed'
                  : errors[i]
                    ? 'border-red-400 bg-red-50 text-red-800'
                    : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
            {locked[i] && (
              <span className="text-sm font-semibold text-green-600">Correct ✓</span>
            )}
            {errors[i] && !locked[i] && (
              <span className="text-sm text-red-600">Try again</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
