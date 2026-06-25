import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { FalseMemoryExperiment } from '@/experiments/false-memory/FalseMemoryExperiment'
import { DecisionMakingExperiment } from '@/experiments/decision-making/DecisionMakingExperiment'
import { ResultsProvider } from '@/context/ResultsProvider'
import { HomePage } from '@/pages/HomePage'
import { ExperimentsPage } from '@/pages/ExperimentsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <ResultsProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/experiments" element={<ExperimentsPage />} />
          <Route path="/experiments/false-memory" element={<FalseMemoryExperiment />} />
          <Route path="/experiments/anchoring-bias" element={<div>Anchoring Bias — coming soon</div>} />
          <Route path="/experiments/decision-making" element={<DecisionMakingExperiment />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ResultsProvider>
    </BrowserRouter>
  )
}
