import type { WordList } from './falseMemory.types'

export const wordLists: WordList[] = [
  {
    id: 'sleep',
    theme: 'Sleep',
    lureWord: 'sleep',
    studyWords: [
      'bed',
      'rest',
      'awake',
      'tired',
      'dream',
      'wake',
      'night',
      'blanket',
      'doze',
      'slumber',
      'snooze',
      'yawn',
    ],
    distractors: ['chair', 'curtain', 'bottle', 'brush'],
  },
  {
    id: 'music',
    theme: 'Music',
    lureWord: 'music',
    studyWords: [
      'song',
      'rhythm',
      'melody',
      'note',
      'band',
      'singer',
      'guitar',
      'beat',
      'harmony',
      'tune',
      'concert',
      'instrument',
    ],
    distractors: ['pencil', 'carpet', 'mountain', 'letter'],
  },
  {
    id: 'food',
    theme: 'Food',
    lureWord: 'food',
    studyWords: [
      'eat',
      'meal',
      'hungry',
      'taste',
      'cook',
      'kitchen',
      'plate',
      'fork',
      'dinner',
      'delicious',
      'recipe',
      'chef',
    ],
    distractors: ['hammer', 'window', 'cloud', 'bicycle'],
  },
]

export function getRandomList(): WordList {
  const idx = Math.floor(Math.random() * wordLists.length)
  const list = wordLists[idx]
  if (list === undefined) throw new Error('No word lists available')
  return list
}
