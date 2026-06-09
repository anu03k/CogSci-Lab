import { useState } from 'react'

interface ConceptCardProps {
  title: string
  body: string
  learnMoreUrl?: string
}

export function ConceptCard({ title, body, learnMoreUrl }: ConceptCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <span
          className={`text-gray-400 inline-block transition-transform duration-200 ${
            expanded ? 'rotate-180' : 'rotate-0'
          }`}
        >
          ▾
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-2 bg-white border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
          {learnMoreUrl !== undefined && (
            <a
              href={learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-indigo-600 hover:text-indigo-800 underline"
            >
              Learn more →
            </a>
          )}
        </div>
      )}
    </div>
  )
}
