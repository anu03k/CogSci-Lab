import type { ProspectScenario, GambleChoice } from './decisionMaking.types'

export const prospectScenarios: ProspectScenario[] = [
  // ── Gain scenarios ──────────────────────────────────────────────────────────
  {
    id: 'gain-1',
    category: 'gain',
    question: 'Which would you prefer?',
    optionA: {
      label: 'Option A',
      description: 'Receive $500 for certain',
      value: 500,
      probability: 1.0,
      isRisky: false,
    },
    optionB: {
      label: 'Option B',
      description: '50% chance to receive $1,200 · 50% chance of nothing',
      value: 600,
      probability: 0.5,
      isRisky: true,
    },
    rationalChoice: 'B',       // EV $600 > $500
    psychologicalChoice: 'A',  // certainty effect
    conceptExplained:
      'Risk aversion in gains: people prefer a certain $500 over a gamble worth $600 in expected value.',
  },
  {
    id: 'gain-2',
    category: 'gain',
    question: 'Which would you prefer?',
    optionA: {
      label: 'Option A',
      description: 'Receive $250 for certain',
      value: 250,
      probability: 1.0,
      isRisky: false,
    },
    optionB: {
      label: 'Option B',
      description: '25% chance to receive $1,100 · 75% chance of nothing',
      value: 275,
      probability: 0.25,
      isRisky: true,
    },
    rationalChoice: 'B',       // EV $275 > $250
    psychologicalChoice: 'A',
    conceptExplained:
      'Certainty effect: a guaranteed outcome feels disproportionately attractive even when the risky option has higher expected value.',
  },

  // ── Loss scenarios ───────────────────────────────────────────────────────────
  {
    id: 'loss-1',
    category: 'loss',
    question: 'Which would you prefer?',
    optionA: {
      label: 'Option A',
      description: 'Lose $500 for certain',
      value: -500,
      probability: 1.0,
      isRisky: false,
    },
    optionB: {
      label: 'Option B',
      description: '50% chance of losing $1,200 · 50% chance of losing nothing',
      value: -600,
      probability: 0.5,
      isRisky: true,
    },
    rationalChoice: 'A',       // expected loss $500 < $600
    psychologicalChoice: 'B',  // gamble to avoid the certain loss
    conceptExplained:
      'Loss aversion: people take risky gambles to avoid a certain loss, even when the gamble is worse on average.',
  },
  {
    id: 'loss-2',
    category: 'loss',
    question: 'Which would you prefer?',
    optionA: {
      label: 'Option A',
      description: 'Lose $400 for certain',
      value: -400,
      probability: 1.0,
      isRisky: false,
    },
    optionB: {
      label: 'Option B',
      description: '40% chance of losing $1,100 · 60% chance of losing nothing',
      value: -440,
      probability: 0.4,
      isRisky: true,
    },
    rationalChoice: 'A',       // expected loss $400 < $440
    psychologicalChoice: 'B',
    conceptExplained:
      'Risk-seeking in losses: the pain of a certain loss feels so severe that people gamble to escape it.',
  },

  // ── Temporal scenarios ───────────────────────────────────────────────────────
  {
    id: 'temporal-1',
    category: 'temporal',
    question: 'Which would you prefer?',
    optionA: {
      label: 'Option A',
      description: 'Receive $400 today',
      value: 400,
      probability: 1.0,
      isRisky: false,
    },
    optionB: {
      label: 'Option B',
      description: 'Receive $600 in 6 months',
      value: 600,
      probability: 1.0,
      isRisky: false,
    },
    rationalChoice: 'B',       // higher value
    psychologicalChoice: 'A',  // present bias
    conceptExplained:
      'Temporal discounting: future rewards are heavily discounted, making $400 now feel better than $600 later.',
  },
  {
    id: 'temporal-2',
    category: 'temporal',
    question: 'Which would you prefer?',
    optionA: {
      label: 'Option A',
      description: 'Receive $500 today',
      value: 500,
      probability: 1.0,
      isRisky: false,
    },
    optionB: {
      label: 'Option B',
      description: 'Receive $1,000 in 2 years',
      value: 1000,
      probability: 1.0,
      isRisky: false,
    },
    rationalChoice: 'B',
    psychologicalChoice: 'A',
    conceptExplained:
      'Present bias: the desire for immediate reward causes people to pass up a 100% gain just to avoid waiting.',
  },
]

// ── Gambles ──────────────────────────────────────────────────────────────────
// For gambles 1–4: Option A has higher EV but higher variance (risky);
// Option B has lower EV but lower variance (safe).
// For gamble 5: Option B has both higher EV and higher variance.

export const gambleChoices: GambleChoice[] = [
  {
    id: 'gamble-1',
    question: 'Which gamble would you play?',
    betterExpectedValue: 'A',  // EV $50 vs $36
    optionA: {
      description: '50% chance to win $200, 50% chance to lose $100',
      winAmount: 200,
      winProbability: 0.5,
      loseAmount: 100,
      loseProbability: 0.5,
      expectedValue: 50,
    },
    optionB: {
      description: '80% chance to win $50, 20% chance to lose $20',
      winAmount: 50,
      winProbability: 0.8,
      loseAmount: 20,
      loseProbability: 0.2,
      expectedValue: 36,
    },
  },
  {
    id: 'gamble-2',
    question: 'Which gamble would you play?',
    betterExpectedValue: 'A',  // EV $110 vs $55
    optionA: {
      description: '40% chance to win $500, 60% chance to lose $150',
      winAmount: 500,
      winProbability: 0.4,
      loseAmount: 150,
      loseProbability: 0.6,
      expectedValue: 110,
    },
    optionB: {
      description: '70% chance to win $100, 30% chance to lose $50',
      winAmount: 100,
      winProbability: 0.7,
      loseAmount: 50,
      loseProbability: 0.3,
      expectedValue: 55,
    },
  },
  {
    id: 'gamble-3',
    question: 'Which gamble would you play?',
    betterExpectedValue: 'A',  // EV $160 vs $74
    optionA: {
      description: '30% chance to win $1,000, 70% chance to lose $200',
      winAmount: 1000,
      winProbability: 0.3,
      loseAmount: 200,
      loseProbability: 0.7,
      expectedValue: 160,
    },
    optionB: {
      description: '80% chance to win $100, 20% chance to lose $30',
      winAmount: 100,
      winProbability: 0.8,
      loseAmount: 30,
      loseProbability: 0.2,
      expectedValue: 74,
    },
  },
  {
    id: 'gamble-4',
    question: 'Which gamble would you play?',
    betterExpectedValue: 'A',  // EV $100 vs $68
    optionA: {
      description: '60% chance to win $300, 40% chance to lose $200',
      winAmount: 300,
      winProbability: 0.6,
      loseAmount: 200,
      loseProbability: 0.4,
      expectedValue: 100,
    },
    optionB: {
      description: '90% chance to win $80, 10% chance to lose $40',
      winAmount: 80,
      winProbability: 0.9,
      loseAmount: 40,
      loseProbability: 0.1,
      expectedValue: 68,
    },
  },
  {
    id: 'gamble-5',
    question: 'Which gamble would you play?',
    betterExpectedValue: 'B',  // EV $52 vs $80 — B is better EV but riskier
    optionA: {
      description: '90% chance to win $60, 10% chance to lose $20',
      winAmount: 60,
      winProbability: 0.9,
      loseAmount: 20,
      loseProbability: 0.1,
      expectedValue: 52,
    },
    optionB: {
      description: '30% chance to win $500, 70% chance to lose $100',
      winAmount: 500,
      winProbability: 0.3,
      loseAmount: 100,
      loseProbability: 0.7,
      expectedValue: 80,
    },
  },
]

export function getShuffledScenarios(): ProspectScenario[] {
  return [...prospectScenarios].sort(() => Math.random() - 0.5)
}

export function getShuffledGambles(): GambleChoice[] {
  return [...gambleChoices].sort(() => Math.random() - 0.5)
}
