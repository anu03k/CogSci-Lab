import type { ReactNode } from 'react'
import { ProgressBar } from './ProgressBar'

interface ExperimentShellProps {
  title: string
  progress?: { current: number; total: number }
  onExit: () => void
  children: ReactNode
}

export function ExperimentShell({
  title,
  progress,
  onExit,
  children,
}: ExperimentShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        <button
          type="button"
          onClick={onExit}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-1 rounded hover:bg-gray-100"
        >
          Exit
        </button>
      </header>

      {progress !== undefined && (
        <div className="bg-white border-b border-gray-100 px-4 py-2">
          <ProgressBar current={progress.current} total={progress.total} />
        </div>
      )}

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
