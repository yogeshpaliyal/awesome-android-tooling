import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import posthog from 'posthog-js'
import siteData from './data.json'
import { SiteHeader } from '@/components/site-header'
import { ToolRow } from '@/components/tool-row'
import { getToolOfTheDay } from '@/lib/utils'
import { getEntryType, type EntryType, type SiteData, type Tool } from '@/types'

const { tools, categories } = siteData as SiteData

type TypeFilter = EntryType | null // null shows every entry
type SortOrder = 'name' | 'stars' | 'updated'

interface Filters {
  category: string | null
  tag: string | null
  type: TypeFilter
}

const allTags = new Set(tools.flatMap((tool) => tool.tags))
const categoryIds = new Set(categories.map((category) => category.id))
const skillCount = tools.filter((tool) => getEntryType(tool) === 'skill').length
const toolOfTheDay = getToolOfTheDay(tools)

// Filters live in the URL (?category=debugging&tag=okhttp&type=skill) so links can be shared
function readFiltersFromUrl(): Filters {
  const params = new URLSearchParams(window.location.search)
  const category = params.get('category')
  const tag = params.get('tag')
  const type = params.get('type')
  return {
    category: category && categoryIds.has(category) ? category : null,
    tag: tag && allTags.has(tag) ? tag : null,
    type: type === 'tool' || type === 'skill' ? type : null,
  }
}

function writeFiltersToUrl(filters: Filters) {
  const url = new URL(window.location.href)
  for (const key of ['category', 'tag', 'type'] as const) {
    const value = filters[key]
    if (value) {
      url.searchParams.set(key, value)
    } else {
      url.searchParams.delete(key)
    }
  }
  if (url.href !== window.location.href) {
    window.history.pushState({}, '', url)
  }
}

function matchesQuery(tool: Tool, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    tool.name.toLowerCase().includes(q) ||
    tool.description.toLowerCase().includes(q) ||
    tool.tags.some((tag) => tag.includes(q)) ||
    (tool.authorName?.toLowerCase().includes(q) ?? false)
  )
}

const sorters: Record<SortOrder, (a: Tool, b: Tool) => number> = {
  name: (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  stars: (a, b) => (b.stars ?? -1) - (a.stars ?? -1) || sorters.name(a, b),
  updated: (a, b) => (b.pushedAt ?? '').localeCompare(a.pushedAt ?? '') || sorters.name(a, b),
}

function App() {
  const [filters, setFilters] = useState<Filters>(readFiltersFromUrl)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOrder>('name')
  const searchRef = useRef<HTMLInputElement>(null)

  const updateFilters = (change: Partial<Filters>) => {
    const next = { ...filters, ...change }
    setFilters(next)
    writeFiltersToUrl(next)
  }

  // Back and Forward restore the filters from the URL
  useEffect(() => {
    const onPopState = () => setFilters(readFiltersFromUrl())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // "/" jumps to the search box, as on GitHub and many docs sites
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return
      event.preventDefault()
      searchRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Everything except the category filter, so each category can show how many entries it would list
  const matching = useMemo(
    () =>
      tools.filter(
        (tool) =>
          matchesQuery(tool, query.trim()) &&
          (filters.tag === null || tool.tags.includes(filters.tag)) &&
          (filters.type === null || getEntryType(tool) === filters.type)
      ),
    [query, filters.tag, filters.type]
  )

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const tool of matching) {
      for (const id of tool.categories) {
        counts.set(id, (counts.get(id) ?? 0) + 1)
      }
    }
    return counts
  }, [matching])

  const visible = useMemo(
    () =>
      matching
        .filter((tool) => filters.category === null || tool.categories.includes(filters.category))
        .sort(sorters[sort]),
    [matching, filters.category, sort]
  )

  const activeCategory = categories.find((category) => category.id === filters.category)
  const hasFilters = Boolean(query || filters.category || filters.tag || filters.type)
  const noun = filters.type === 'skill' ? 'skill' : filters.type === 'tool' ? 'tool' : 'entry'
  const plural = (count: number) =>
    count === 1 ? noun : noun === 'entry' ? 'entries' : `${noun}s`

  const clearFilters = () => {
    setQuery('')
    updateFilters({ category: null, tag: null, type: null })
  }

  const selectTag = (tag: string) => updateFilters({ tag: filters.tag === tag ? null : tag })

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#tools"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-2 focus:z-30 focus:rounded focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to the list
      </a>
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 sm:px-6">
        <section className="max-w-3xl space-y-3 pb-6 pt-8 sm:pb-8 sm:pt-10" aria-labelledby="page-title">
          <h1 id="page-title" className="text-2xl font-semibold tracking-tight text-balance sm:text-4xl">
            Tools for building, debugging and shipping Android apps
          </h1>
          <p className="text-muted">
            {tools.length} hand-picked command-line tools, Android Studio features, libraries, web tools and AI agent
            skills. The list is open source, and anyone can{' '}
            <a
              href="https://github.com/yogeshpaliyal/awesome-android-tooling/blob/master/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2"
            >
              suggest a tool
            </a>
            .
          </p>
          {toolOfTheDay && (
            <p className="font-mono text-sm text-muted">
              Tool of the day:{' '}
              <a
                href={toolOfTheDay.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => posthog.capture('tool_of_the_day', { tool: toolOfTheDay.name })}
                className="text-accent underline underline-offset-2"
              >
                {toolOfTheDay.name}
              </a>
            </p>
          )}
        </section>

        <div className="grid gap-x-10 gap-y-6 lg:grid-cols-[13rem_minmax(0,1fr)]">
          <aside className="min-w-0 lg:sticky lg:top-20 lg:self-start">
            {skillCount > 0 && (
              <div
                role="group"
                aria-label="Show tools or AI agent skills"
                className="mb-4 inline-flex rounded-md border p-0.5 text-sm"
              >
                {(
                  [
                    [null, 'All'],
                    ['tool', 'Tools'],
                    ['skill', 'AI skills'],
                  ] as [TypeFilter, string][]
                ).map(([type, label]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => updateFilters({ type })}
                    aria-pressed={filters.type === type}
                    className={`rounded px-2.5 py-1 transition-colors ${
                      filters.type === type ? 'bg-accent-soft font-medium text-accent' : 'text-muted hover:text-fg'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            <nav aria-label="Categories">
              <h2 className="mb-2 hidden font-mono text-xs uppercase tracking-wider text-muted lg:block">Category</h2>
              <ul className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">
                {[{ id: null, label: 'All', count: matching.length }, ...categories.map((category) => ({
                  id: category.id as string | null,
                  label: category.label,
                  count: categoryCounts.get(category.id) ?? 0,
                }))].map(({ id, label, count }) => {
                  const selected = filters.category === id
                  return (
                    <li key={label} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => updateFilters({ category: id })}
                        aria-current={selected ? 'true' : undefined}
                        className={`flex w-full items-center justify-between gap-3 whitespace-nowrap rounded-md border px-2.5 py-1.5 text-left text-sm transition-colors lg:border-transparent ${
                          selected
                            ? 'border-accent bg-accent-soft font-medium text-fg'
                            : 'text-muted hover:bg-accent-soft hover:text-fg'
                        } ${count === 0 && !selected ? 'opacity-50' : ''}`}
                      >
                        <span>{label}</span>
                        <span className="font-mono text-xs tabular-nums">{count}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </aside>

          <section id="tools" aria-labelledby="results-heading" className="min-w-0 scroll-mt-20">
            <div className="relative">
              <label htmlFor="search" className="sr-only">
                Search tools
              </label>
              <Search aria-hidden="true" size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                ref={searchRef}
                id="search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setQuery('')
                }}
                placeholder="Search tools, tags and authors"
                autoComplete="off"
                className="h-11 w-full rounded-md border bg-surface pl-10 pr-10 text-base placeholder:text-muted focus:border-accent focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <kbd
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border px-1.5 font-mono text-xs text-muted sm:block"
              >
                /
              </kbd>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="results-heading" className="font-mono text-sm text-muted" aria-live="polite">
                  {visible.length} {plural(visible.length)}
                  {activeCategory ? ` in ${activeCategory.label}` : ''}
                </h2>
                {filters.tag && (
                  <button
                    type="button"
                    onClick={() => updateFilters({ tag: null })}
                    className="inline-flex items-center gap-1 rounded border border-accent bg-accent-soft px-1.5 py-0.5 font-mono text-xs text-accent"
                    aria-label={`Remove tag filter ${filters.tag}`}
                  >
                    tag: {filters.tag}
                    <X aria-hidden="true" size={12} />
                  </button>
                )}
                {hasFilters && (
                  <button type="button" onClick={clearFilters} className="text-sm text-muted underline underline-offset-2 hover:text-fg">
                    Clear filters
                  </button>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm text-muted">
                Sort
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortOrder)}
                  className="rounded-md border bg-surface px-2 py-1 text-fg"
                >
                  <option value="name">Name, A to Z</option>
                  <option value="stars">Most GitHub stars</option>
                  <option value="updated">Recently updated</option>
                </select>
              </label>
            </div>

            {visible.length > 0 ? (
              <ul className="mt-3 border-b">
                {visible.map((tool) => (
                  <ToolRow key={tool.link} tool={tool} selectedTag={filters.tag} onTagSelect={selectTag} />
                ))}
              </ul>
            ) : (
              <div className="mt-6 rounded-md border border-dashed p-8 text-center">
                <p className="font-medium">Nothing matches {query ? <>“{query}”</> : 'these filters'}.</p>
                <p className="mt-1 text-sm text-muted">
                  Try another word, or{' '}
                  <button type="button" onClick={clearFilters} className="text-accent underline underline-offset-2">
                    clear the filters
                  </button>
                  . If a tool is missing,{' '}
                  <a
                    href="https://github.com/yogeshpaliyal/awesome-android-tooling/blob/master/CONTRIBUTING.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline underline-offset-2"
                  >
                    suggest it
                  </a>
                  .
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-6 font-mono text-xs text-muted sm:px-6">
          <p>
            Curated on{' '}
            <a href="https://github.com/yogeshpaliyal/awesome-android-tooling" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-accent">
              GitHub
            </a>{' '}
            by Yogesh Paliyal and contributors. MIT license.
          </p>
          <p className="flex gap-4">
            <span>For AI agents:</span>
            <a href={`${import.meta.env.BASE_URL}llms.txt`} className="underline underline-offset-2 hover:text-accent">
              llms.txt
            </a>
            <a href={`${import.meta.env.BASE_URL}tools.json`} className="underline underline-offset-2 hover:text-accent">
              tools.json
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
