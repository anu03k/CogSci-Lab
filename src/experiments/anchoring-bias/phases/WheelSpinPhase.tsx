import { useState, type TransitionEvent } from 'react'

interface Props {
  wheelNumbers: number[]
  forcedResult: number
  onComplete: (result: number) => void
}

type SpinState = 'idle' | 'spinning' | 'landed'

const SEGMENT_COLORS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981',
  '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6',
]

function segmentColor(index: number): string {
  return SEGMENT_COLORS[index % SEGMENT_COLORS.length] ?? '#6366f1'
}

export function WheelSpinPhase({ wheelNumbers, forcedResult, onComplete }: Props) {
  const [spinState, setSpinState] = useState<SpinState>('idle')
  const [rotation, setRotation] = useState(0)

  const segmentDeg = 360 / wheelNumbers.length
  const targetIndex = Math.max(0, wheelNumbers.indexOf(forcedResult))
  // Center of the target segment, measured clockwise from top
  const targetCenter = targetIndex * segmentDeg + segmentDeg / 2
  // Rotate clockwise so targetCenter reaches the pointer at top (angle 0)
  const finalRotation = 5 * 360 + (360 - targetCenter)

  // Build conic-gradient: CSS conic-gradient from 0deg starts at 12 o'clock by default
  const gradientParts = wheelNumbers.map((_, i) => {
    const start = i * segmentDeg
    const end = (i + 1) * segmentDeg
    return `${segmentColor(i)} ${start}deg ${end}deg`
  })
  const gradientBackground = `conic-gradient(${gradientParts.join(', ')})`

  function handleSpin() {
    setSpinState('spinning')
    setRotation(finalRotation)
  }

  function handleTransitionEnd(e: TransitionEvent<HTMLDivElement>) {
    if (e.propertyName === 'transform' && spinState === 'spinning') {
      setSpinState('landed')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Spin the Wheel</h2>
        <p className="mt-1 text-gray-500">Spin the wheel, then you will answer one question.</p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center">
          {/* Downward-pointing pointer above the wheel */}
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[22px] border-l-transparent border-r-transparent border-t-gray-900" />

          {/* Spinning wheel */}
          <div
            data-testid="wheel-display"
            className="relative w-64 h-64 rounded-full border-4 border-gray-900 overflow-hidden"
            style={{
              background: gradientBackground,
              transform: `rotate(${rotation}deg)`,
              transition:
                spinState === 'spinning'
                  ? 'transform 3s cubic-bezier(0.2, 0, 0.05, 1)'
                  : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {/* Number labels */}
            {wheelNumbers.map((num, i) => {
              const angleDeg = i * segmentDeg + segmentDeg / 2
              const angleRad = (angleDeg * Math.PI) / 180
              const r = 84
              const x = 128 + r * Math.sin(angleRad)
              const y = 128 - r * Math.cos(angleRad)
              return (
                <span
                  key={num}
                  className="absolute text-sm font-bold text-white pointer-events-none select-none drop-shadow -translate-x-1/2 -translate-y-1/2"
                  style={{ left: x, top: y }}
                >
                  {num}
                </span>
              )
            })}
            {/* Center cap */}
            <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white border-2 border-gray-900" />
          </div>
        </div>

        {spinState === 'idle' && (
          <button
            type="button"
            data-testid="spin-btn"
            onClick={handleSpin}
            className="rounded-lg bg-indigo-600 px-10 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Spin!
          </button>
        )}

        {spinState === 'spinning' && (
          <p className="text-sm font-medium text-gray-500 animate-pulse">Spinning…</p>
        )}

        {spinState === 'landed' && (
          <div className="w-full max-w-sm space-y-4">
            <div
              data-testid="wheel-result-display"
              className="rounded-xl border-2 border-indigo-200 bg-indigo-50 px-6 py-4 text-center"
            >
              <p className="text-sm font-medium text-indigo-600">The wheel landed on</p>
              <p className="text-4xl font-bold text-indigo-900 mt-1">{forcedResult}</p>
            </div>
            <button
              type="button"
              data-testid="wheel-continue-btn"
              onClick={() => onComplete(forcedResult)}
              className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
