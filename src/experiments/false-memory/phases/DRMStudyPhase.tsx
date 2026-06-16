import { useEffect, useRef, useState } from 'react'
import type { WordList } from '@/experiments/false-memory/falseMemory.types'

interface Props {
  lists: WordList[]
  currentListIndex: number
  onListComplete: (index: number) => void
  onAllListsComplete: () => void
}

export function DRMStudyPhase({ lists, currentListIndex, onListComplete, onAllListsComplete }: Props) {
  const [wordIndex, setWordIndex] = useState(0)
  const [showInterstitial, setShowInterstitial] = useState(false)
  const allDoneRef = useRef(false)

  // Auto-advance words every 1500 ms
  useEffect(() => {
    if (showInterstitial) return
    const currentList = lists[currentListIndex]
    if (!currentList) return

    const timer = setTimeout(() => {
      const isLastWord = wordIndex >= currentList.studyWords.length - 1
      if (!isLastWord) {
        setWordIndex((w) => w + 1)
        return
      }
      const isLastList = currentListIndex >= lists.length - 1
      if (isLastList) {
        if (!allDoneRef.current) {
          allDoneRef.current = true
          onAllListsComplete()
        }
      } else {
        setShowInterstitial(true)
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [wordIndex, showInterstitial, currentListIndex, lists, onAllListsComplete])

  // Interstitial: wait 3 s then tell parent to advance the list index
  useEffect(() => {
    if (!showInterstitial) return
    const timer = setTimeout(() => {
      onListComplete(currentListIndex)
      // Parent increments currentListIndex → the first useEffect resets local state
    }, 3000)
    return () => clearTimeout(timer)
  }, [showInterstitial, currentListIndex, onListComplete])

  const currentList = lists[currentListIndex]

  if (!currentList) return null

  if (showInterstitial) {
    return (
      <div className="flex flex-col items-center justify-center min-h-48 space-y-4">
        <p className="text-xl font-medium text-gray-600">Prepare for the next list…</p>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  const word = currentList.studyWords[wordIndex] ?? ''

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <span
          data-testid="study-list-indicator"
          className="text-sm font-medium text-indigo-600 uppercase tracking-wide"
        >
          List {currentListIndex + 1} of {lists.length}
        </span>
        <span
          data-testid="study-list-counter"
          className="text-sm text-gray-400"
        >
          Word {wordIndex + 1} of {currentList.studyWords.length}
        </span>
      </div>

      <div className="flex items-center justify-center min-h-40 rounded-xl border-2 border-indigo-100 bg-white shadow-sm">
        <p
          data-testid="study-word-display"
          className="text-4xl font-bold text-gray-900 tracking-wide"
        >
          {word}
        </p>
      </div>

      <p className="text-center text-sm text-gray-400">
        Read each word carefully. Words advance automatically.
      </p>
    </div>
  )
}
