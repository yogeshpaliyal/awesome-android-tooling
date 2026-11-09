import { useEffect, useState } from 'react'
import { Github, Moon, Plus, Sun } from 'lucide-react'

const REPO_URL = 'https://github.com/yogeshpaliyal/awesome-android-tooling'
const SUBMIT_URL = `${REPO_URL}/blob/master/CONTRIBUTING.md`

type Theme = 'light' | 'dark'

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem('theme')
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

// Follows the system setting until the visitor picks a theme, then remembers the pick
function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (readStoredTheme()) return
      const next: Theme = media.matches ? 'dark' : 'light'
      applyTheme(next)
      setTheme(next)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Storage can be blocked; the choice then lasts until the page reloads
    }
  }

  return [theme, toggle]
}

const iconButton =
  'inline-flex h-9 w-9 items-center justify-center rounded-md text-muted hover:bg-accent-soft hover:text-fg transition-colors'

export function SiteHeader() {
  const [theme, toggleTheme] = useTheme()

  return (
    <header className="sticky top-0 z-20 border-b bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href={import.meta.env.BASE_URL} className="flex min-w-0 items-center gap-2 whitespace-nowrap text-sm font-semibold tracking-tight sm:text-base">
          <span aria-hidden="true" className="font-mono text-accent">{'>_'}</span>
          <span>Awesome Android Tooling</span>
        </a>

        <nav aria-label="Site" className="flex items-center gap-1">
          <a
            href={SUBMIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mr-1 inline-flex items-center gap-1.5 rounded-md border border-accent px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent-soft transition-colors"
          >
            <Plus aria-hidden="true" size={16} />
            <span>
              Submit<span className="hidden sm:inline"> a tool</span>
            </span>
          </a>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={iconButton} aria-label="Source on GitHub">
            <Github aria-hidden="true" size={18} />
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            className={iconButton}
            aria-label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
          >
            {theme === 'dark' ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}
          </button>
        </nav>
      </div>
    </header>
  )
}
