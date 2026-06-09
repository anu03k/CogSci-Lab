interface ProgressBarProps {
  current: number
  total: number
  label?: string
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="w-full space-y-1">
      {label !== undefined && (
        <div className="flex justify-between text-sm text-gray-500">
          <span>{label}</span>
          <span>
            {current} / {total}
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={label ?? `Progress: ${current} of ${total}`}
        className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
      >
        <div
          className="bg-indigo-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
