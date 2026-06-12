import { useCallback, useRef, useState } from 'react'
import { useTimer } from '@/shared/hooks/useTimer'

interface Props {
  onComplete: (text: string) => void
}

export function DRMFreeRecallPhase({ onComplete }: Props) {
  const [text, setText] = useState('')
  const textRef = useRef('')
  const doneRef = useRef(false)

  const handleDone = useCallback(
    (value: string) => {
      if (!doneRef.current) {
        doneRef.current = true
        onComplete(value)
      }
    },
    [onComplete],
  )

  const handleExpire = useCallback(() => {
    handleDone(textRef.current)
  }, [handleDone])

  const { remaining } = useTimer(120, handleExpire)

  const handleChange = (value: string) => {
    setText(value)
    textRef.current = value
  }

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const timeLabel = `${minutes}:${String(seconds).padStart(2, '0')}`
  const timerUrgent = remaining <= 30

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Free Recall</h2>
        <p className="mt-1 text-gray-500">
          Write every word you can remember from all three lists. Separate with commas or new lines.
          Do not guess — only words you genuinely remember.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2">
        <span className="text-sm text-gray-500">Time remaining</span>
        <span
          data-testid="free-recall-timer"
          className={`text-2xl font-bold tabular-nums ${timerUrgent ? 'text-red-600' : 'text-indigo-600'}`}
        >
          {timeLabel}
        </span>
      </div>

      <textarea
        data-testid="free-recall-textarea"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="bed, rest, dream…"
        rows={8}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
      />

      <button
        type="button"
        data-testid="free-recall-submit-btn"
        disabled={text.length < 10}
        onClick={() => handleDone(text)}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
      >
        Submit recall
      </button>
    </div>
  )
}
