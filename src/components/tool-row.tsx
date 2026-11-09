import { Star } from 'lucide-react'
import { formatNumber, formatRelativeTime, linkSource } from '@/lib/utils'
import { getEntryType, type Tool } from '@/types'

interface ToolRowProps {
  tool: Tool
  selectedTag: string | null
  onTagSelect: (tag: string) => void
}

export function ToolRow({ tool, selectedTag, onTagSelect }: ToolRowProps) {
  const isSkill = getEntryType(tool) === 'skill'

  return (
    <li className="grid gap-x-6 gap-y-2 border-t py-5 sm:grid-cols-[minmax(0,1fr)_9rem]">
      <div className="min-w-0 space-y-1.5">
        <h3 className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <a
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold leading-snug text-fg underline decoration-line decoration-1 underline-offset-4 hover:text-accent hover:decoration-accent"
          >
            {tool.name}
          </a>
          {isSkill && (
            <span className="rounded bg-accent-soft px-1.5 py-0.5 font-mono text-xs text-accent">AI agent skill</span>
          )}
          <span className="font-mono text-xs text-muted">{linkSource(tool.link)}</span>
        </h3>

        <p className="max-w-[72ch] text-[0.95rem] leading-relaxed text-muted">{tool.description}</p>

        <ul className="flex flex-wrap gap-1.5 pt-1" aria-label={`Tags for ${tool.name}`}>
          {tool.tags.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                onClick={() => onTagSelect(tag)}
                aria-pressed={selectedTag === tag}
                className={`rounded border px-1.5 py-0.5 font-mono text-xs transition-colors ${
                  selectedTag === tag
                    ? 'border-accent bg-accent-soft text-accent'
                    : 'text-muted hover:border-accent hover:text-accent'
                }`}
              >
                {tag}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dl className="flex flex-wrap gap-x-4 gap-y-0.5 font-mono text-xs text-muted sm:flex-col sm:items-end sm:text-right">
        {tool.stars !== undefined && (
          <div className="flex items-center gap-1" title={`${tool.stars.toLocaleString()} stars on GitHub`}>
            <dt>
              <Star aria-hidden="true" size={13} />
              <span className="sr-only">GitHub stars</span>
            </dt>
            <dd className="text-fg tabular-nums">{formatNumber(tool.stars)}</dd>
          </div>
        )}
        {tool.pushedAt && (
          <div className="flex gap-1">
            <dt>updated</dt>
            <dd>{formatRelativeTime(tool.pushedAt)}</dd>
          </div>
        )}
        {tool.authorName && (
          <div className="flex min-w-0 gap-1">
            <dt>by</dt>
            <dd className="min-w-0 truncate">
              {tool.authorLink ? (
                <a href={tool.authorLink} target="_blank" rel="noopener noreferrer" className="hover:text-accent hover:underline">
                  {tool.authorName}
                </a>
              ) : (
                tool.authorName
              )}
            </dd>
          </div>
        )}
      </dl>
    </li>
  )
}
