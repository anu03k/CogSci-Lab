import { useNavigate } from 'react-router-dom'
import { useResults } from '@/context/ResultsContext'
import { EXPERIMENTS } from '@/data/experiments.registry'
import type { ExperimentId } from '@/shared/types/experiment.types'

export function HomePage() {
  const navigate = useNavigate()
  const { results } = useResults()

  const completedCount = new Set<ExperimentId>(results.map((r) => r.experimentId))
    .size

  return (
    <div
      data-testid="home-page"
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4"
    >
      <div className="max-w-lg w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Psychology Experiment Lab
        </h1>
        <p className="text-lg text-gray-500">
          Explore how your mind works through interactive cognitive science
          experiments.
        </p>
        <p className="text-sm text-gray-400">
          {completedCount} of {EXPERIMENTS.length} experiments completed
        </p>
        <button
          type="button"
          onClick={() => void navigate('/experiments')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Start an Experiment
        </button>
      </div>
    </div>
  )
}
