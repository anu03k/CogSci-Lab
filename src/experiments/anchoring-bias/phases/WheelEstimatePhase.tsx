import { useState } from 'react'

interface Props {
  estimateQuestion: string
  unit: string
  min: number
  max: number
  wheelResult: number
  onSubmit: (value: number) => void
}

export function WheelEstimatePhase({
  estimateQuestion,
  unit,
  min,
  max,
  wheelResult,
  onSubmit,
}: Props) {
  const [rawValue, setRawValue] = useState('')

  const trimmed = rawValue.trim()
  const numValue = trimmed === '' ? NaN : Number(trimmed)
  const isValidNumber = !isNaN(numValue) && isFinite(numValue)
  const isInRange = isValidNumber && numValue >= min && numValue <= max
  const showError = trimmed !== '' && !isInRange

  const errorMsg = !isValidNumber
    ? 'Please enter a valid number.'
    : `Please enter a value between ${min.toLocaleString()} and ${max.toLocaleString()}.`

  function handleSubmit() {
    if (!isInRange) return
    onSubmit(numValue)
  }

  return (
    <div className="space-y-6">
      <div
        data-testid="wheel-result-shown"
        className="rounded-xl border-2 border-indigo-200 bg-indigo-50 px-6 py-4 text-center"
      >
        <p className="text-sm font-medium text-indigo-600">The wheel landed on</p>
        <p className="text-4xl font-bold text-indigo-900 mt-1">{wheelResult}</p>
      </div>

      <p className="text-xl font-semibold text-gray-900 leading-snug">{estimateQuestion}</p>

      <div className="space-y-3">
        <p className="text-sm text-gray-500">
          Enter a value between {min.toLocaleString()} and {max.toLocaleString()}
        </p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            data-testid="wheel-estimate-input"
            value={rawValue}
            onChange={(e) => setRawValue(e.target.value)}
            className="w-44 rounded-lg border border-gray-300 px-4 py-2.5 text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Your estimate"
          />
          <span data-testid="wheel-estimate-unit" className="text-base font-medium text-gray-600">
            {unit}
          </span>
        </div>
        {showError && (
          <p role="alert" className="text-sm text-red-600">
            {errorMsg}
          </p>
        )}
      </div>

      <button
        type="button"
        data-testid="wheel-estimate-submit-btn"
        onClick={handleSubmit}
        disabled={!isInRange}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Submit estimate
      </button>
    </div>
  )
}
