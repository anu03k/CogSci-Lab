import type { AnchorScenario, WheelScenario } from './anchoring.types'

export const anchorScenarios: AnchorScenario[] = [
  {
    id: 'gandhi',
    topic: "Gandhi's age at death",
    actualAnswer: 78,
    actualAnswerLabel: 'Gandhi was 78 years old when he died.',
    highAnchorQuestion: 'Was Gandhi older or younger than 144 when he died?',
    highAnchorValue: 144,
    lowAnchorQuestion: 'Was Gandhi older or younger than 9 when he died?',
    lowAnchorValue: 9,
    estimateQuestion: 'How old was Gandhi when he died?',
    unit: 'years old',
    minEstimate: 1,
    maxEstimate: 144,
  },
  {
    id: 'moon-distance',
    topic: 'Distance from Earth to the Moon',
    actualAnswer: 384400,
    actualAnswerLabel: 'The Moon is approximately 384,400 km from Earth.',
    highAnchorQuestion: 'Is the Moon closer or farther than 1,000,000 km from Earth?',
    highAnchorValue: 1000000,
    lowAnchorQuestion: 'Is the Moon closer or farther than 50,000 km from Earth?',
    lowAnchorValue: 50000,
    estimateQuestion: 'How many kilometers is the Moon from Earth?',
    unit: 'km',
    minEstimate: 10000,
    maxEstimate: 1000000,
  },
  {
    id: 'amazon-river',
    topic: 'Length of the Amazon River',
    actualAnswer: 6437,
    actualAnswerLabel: 'The Amazon River is approximately 6,437 km long.',
    highAnchorQuestion: 'Is the Amazon River longer or shorter than 15,000 km?',
    highAnchorValue: 15000,
    lowAnchorQuestion: 'Is the Amazon River longer or shorter than 500 km?',
    lowAnchorValue: 500,
    estimateQuestion: 'How many kilometers long is the Amazon River?',
    unit: 'km',
    minEstimate: 100,
    maxEstimate: 15000,
  },
]

export const wheelScenarios: WheelScenario[] = [
  {
    id: 'african-countries-un',
    wheelNumbers: [10, 25, 40, 55, 70, 85],
    estimateQuestion: 'What percentage of UN member countries are in Africa?',
    topic: 'African countries in the UN',
    actualAnswer: 54,
    actualAnswerLabel: '54 of the 193 UN member countries (about 28%) are in Africa.',
    unit: '%',
    minEstimate: 1,
    maxEstimate: 100,
  },
  {
    id: 'kilimanjaro-height',
    wheelNumbers: [1000, 2500, 4000, 5500, 7000, 8500],
    estimateQuestion: 'How tall is Mount Kilimanjaro in meters?',
    topic: 'Height of Mount Kilimanjaro',
    actualAnswer: 5895,
    actualAnswerLabel: 'Mount Kilimanjaro is 5,895 meters tall.',
    unit: 'meters',
    minEstimate: 500,
    maxEstimate: 8500,
  },
]

export function getRandomScenario(): AnchorScenario {
  const index = Math.floor(Math.random() * anchorScenarios.length)
  return anchorScenarios[index]!
}

export function getRandomWheelScenario(): WheelScenario {
  const index = Math.floor(Math.random() * wheelScenarios.length)
  return wheelScenarios[index]!
}

export function getRandomWheelValue(scenario: WheelScenario): number {
  const { wheelNumbers } = scenario
  const index = Math.floor(Math.random() * wheelNumbers.length)
  return wheelNumbers[index]!
}
