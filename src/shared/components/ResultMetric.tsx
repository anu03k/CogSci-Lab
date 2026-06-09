interface ResultMetricProps {
  label: string
  value: string | number
  highlight?: boolean
}

export function ResultMetric({ label, value, highlight = false }: ResultMetricProps) {
  return (
    <div
      className={`rounded-lg p-4 border ${
        highlight
          ? 'bg-indigo-50 border-indigo-200'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p
        className={`mt-1 text-2xl font-bold ${
          highlight ? 'text-indigo-700' : 'text-gray-900'
        }`}
      >
        {value}
      </p>
    </div>
  )
}
