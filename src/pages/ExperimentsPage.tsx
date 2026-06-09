import { useNavigate } from 'react-router-dom'
import { EXPERIMENTS } from '@/data/experiments.registry'
import type { ExperimentMeta } from '@/shared/types/experiment.types'

const difficultyColors: Record<ExperimentMeta['difficulty'], string> = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard: 'bg-red-100 text-red-700',
}

export function ExperimentsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Experiments</h1>
        <p className="text-gray-500 mb-8">Choose an experiment to begin.</p>

        <div className="space-y-4">
          {EXPERIMENTS.map((exp) => (
            <div
              key={exp.id}
              data-testid={`experiment-card-${exp.id}`}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {exp.title}
                    </h2>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColors[exp.difficulty]}`}
                    >
                      {exp.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-3">{exp.subtitle}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {exp.concepts.map((concept) => (
                      <span
                        key={concept}
                        className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">{exp.duration}</p>
                </div>

                <button
                  type="button"
                  onClick={() => void navigate(exp.route)}
                  className="shrink-0 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
