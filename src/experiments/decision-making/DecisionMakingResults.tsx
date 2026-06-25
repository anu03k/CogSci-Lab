import { useEffect, useRef } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ConceptCard } from '@/shared/components/ConceptCard'
import { ResultMetric } from '@/shared/components/ResultMetric'
import { resultsStorage } from '@/storage/resultsStorage'
import { prospectScenarios } from '@/experiments/decision-making/decisionMaking.data'
import type { DecisionMakingResult } from './decisionMaking.types'

interface Props {
  result: DecisionMakingResult
  onRetry: () => void
  onHome: () => void
}

const PROFILE_CLASSES = {
  'Risk-Averse': 'bg-blue-100 text-blue-800 border-blue-300',
  'Balanced': 'bg-green-100 text-green-800 border-green-300',
  'Risk-Seeking': 'bg-orange-100 text-orange-800 border-orange-300',
} as const

const PROFILE_DESCRIPTIONS = {
  'Risk-Averse':
    'You consistently favour certainty over expected-value-maximising gambles. Loss aversion is likely a strong driver: the psychological pain of potential losses outweighs the appeal of equivalent gains. This is the most common profile.',
  'Balanced':
    'Your choices reflect a moderate balance between caution and risk-taking. You respond to expected value but also show sensitivity to loss framing — a profile typical of experienced decision-makers.',
  'Risk-Seeking':
    'You favour high-variance options and are willing to accept unfavourable expected values for a chance at large gains. This profile is associated with gambling behaviour and sensation-seeking tendencies.',
} as const

export function DecisionMakingResults({ result, onRetry, onHome }: Props) {
  const savedRef = useRef(false)
  useEffect(() => {
    if (savedRef.current) return
    savedRef.current = true
    resultsStorage.save({
      id: crypto.randomUUID(),
      experimentId: 'decision-making',
      completedAt: new Date().toISOString(),
      durationMs: result.prospect.durationMs + result.risk.durationMs,
      data: result,
    })
  }, [result])

  const responses = result.prospect.responses

  // Compute per-category rational/psychological counts for grouped bar chart
  const categories = ['gain', 'loss', 'temporal'] as const
  const prospectChartData = categories.map((cat) => {
    const catScenarios = prospectScenarios.filter((s) => s.category === cat)
    const rational = catScenarios.filter((s) => responses[s.id] === s.rationalChoice).length
    const psychological = catScenarios.length - rational
    return {
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      Rational: rational,
      Psychological: psychological,
    }
  })

  // Risk profile chart: safe vs risky vs EV-aligned
  const riskScore = Math.round(result.risk.riskScore)
  const evAlignment = Math.round(result.risk.expectedValueAlignment)

  return (
    <div data-testid="dm-results-page" className="space-y-10 pb-8">

      {/* ── Section 1: Overall Profile ────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Your Decision Profile</h2>

        <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center">
          <span
            data-testid="dm-profile-badge"
            className={`rounded-full border-2 px-8 py-3 text-xl font-bold ${PROFILE_CLASSES[result.overallProfile]}`}
          >
            {result.overallProfile}
          </span>

          <div className="w-full max-w-sm space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Risk score</span>
                <span className="font-semibold text-gray-900 tabular-nums">{riskScore} / 100</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  data-testid="dm-risk-score-meter"
                  className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                  style={{ width: `${riskScore}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Risk-Averse</span>
                <span>Risk-Seeking</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Loss aversion score</span>
                <span className="font-semibold text-gray-900 tabular-nums">{result.lossAversionScore} / 100</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  data-testid="dm-loss-aversion-meter"
                  className="h-full rounded-full bg-red-400 transition-all duration-700"
                  style={{ width: `${result.lossAversionScore}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
            {PROFILE_DESCRIPTIONS[result.overallProfile]}
          </p>
        </div>
      </section>

      {/* ── Section 2: Prospect Theory ────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Test 1: Prospect Theory</h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ResultMetric
            label="Rational choices"
            value={`${result.prospect.rationalChoices} / ${result.prospect.totalScenarios}`}
          />
          <ResultMetric
            label="Rationality score"
            value={`${Math.round(result.prospect.consistencyScore)}%`}
            highlight={result.prospect.consistencyScore > 60}
          />
          <ResultMetric
            label="Loss aversion"
            value={result.prospect.lossAversionEvidence ? 'Detected' : 'None'}
          />
          <ResultMetric
            label="Present bias"
            value={result.prospect.temporalDiscounting ? 'Detected' : 'None'}
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Rational vs Psychological choices by category
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={prospectChartData}
              aria-label="Grouped bar chart showing rational vs psychological choices across gain, loss, and temporal scenarios"
              role="img"
            >
              <title>Prospect theory results — rational vs psychological by category</title>
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                label={{
                  value: 'Choices',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,
                  style: { fontSize: 11 },
                }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="Rational" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Psychological" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          <ConceptCard
            title="Prospect Theory"
            body="Kahneman and Tversky (1979) proposed Prospect Theory as an alternative to expected utility theory. It holds that people evaluate outcomes relative to a reference point (usually the status quo), weight losses more heavily than equivalent gains (loss aversion), and assign diminishing sensitivity to incremental changes. The resulting S-shaped value function explains why a certain $500 feels more appealing than a 50% shot at $1,200 — even though the gamble has higher expected value."
          />
          <ConceptCard
            title="Loss Aversion"
            body='The pain of losing $100 is roughly twice as powerful as the pleasure of gaining $100. This asymmetry — first demonstrated by Kahneman and Tversky — explains why people gamble to avoid a sure loss ("I might get lucky") but avoid gambling when facing a sure gain ("I already have it"). Loss aversion drives endowment effects, status-quo bias, and many financial decisions that puzzle rational models.'
          />
        </div>
      </section>

      {/* ── Section 3: Risk Profile ────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Test 2: Risk Profile</h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ResultMetric
            label="Safe choices"
            value={`${result.risk.safeChoices} / ${result.risk.totalGambles}`}
          />
          <ResultMetric
            label="Risky choices"
            value={`${result.risk.riskyChoices} / ${result.risk.totalGambles}`}
            highlight={result.risk.riskyChoices > result.risk.safeChoices}
          />
          <ResultMetric
            label="EV-aligned"
            value={`${evAlignment}%`}
            highlight={evAlignment > 60}
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Safe vs Risky gamble choices
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={[
                { name: 'Safe', value: result.risk.safeChoices, fill: '#3b82f6' },
                { name: 'Risky', value: result.risk.riskyChoices, fill: '#f97316' },
              ]}
              aria-label="Bar chart comparing safe vs risky gamble choices"
              role="img"
            >
              <title>Risk profile — safe vs risky choices</title>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                label={{
                  value: 'Gambles',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,
                  style: { fontSize: 11 },
                }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                {[
                  { name: 'Safe', value: result.risk.safeChoices, fill: '#3b82f6' },
                  { name: 'Risky', value: result.risk.riskyChoices, fill: '#f97316' },
                ].map((entry, i) => (
                  <Cell key={`risk-${i}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-3 text-center">
            <span
              className={`inline-block rounded-full px-4 py-1 text-sm font-semibold ${
                result.risk.riskProfile === 'Risk-Averse'
                  ? 'bg-blue-100 text-blue-800'
                  : result.risk.riskProfile === 'Risk-Seeking'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {result.risk.riskProfile}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <ConceptCard
            title="Temporal Discounting"
            body='People systematically undervalue future rewards relative to immediate ones — a phenomenon called temporal discounting or hyperbolic discounting. Given the choice between $400 today and $600 in six months, most choose the immediate reward even though waiting yields a 50% return in half a year. The discount rate implied by human choices is far steeper than rational financial models would predict, driving procrastination, poor saving behaviour, and short-term thinking in policy contexts.'
          />
          <ConceptCard
            title="Risk Perception"
            body="Expected Value (EV) is a normative benchmark: multiply each outcome by its probability and sum. A rational agent should always choose the higher-EV option. In practice, people are not EV-maximisers — they are influenced by variance (preferring lower-variance outcomes in gains), framing (losses loom larger than gains), and probability distortion (overweighting small probabilities and underweighting near-certainties). Understanding your own deviation from EV reasoning is the first step toward more deliberate financial and life decisions."
          />
        </div>
      </section>

      {/* ── Actions ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          data-testid="dm-retry-btn"
          onClick={onRetry}
          className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          Try again
        </button>
        <button
          type="button"
          data-testid="dm-home-btn"
          onClick={onHome}
          className="flex-1 rounded-lg border border-gray-200 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Back to experiments
        </button>
      </div>
    </div>
  )
}
