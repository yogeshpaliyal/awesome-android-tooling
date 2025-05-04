import { cn } from "@/lib/utils"

interface HeaderProps {
  darkMode: boolean
  toggleDarkMode: () => void
  scrolled: boolean
  heroVisible: boolean
}

export function Header({ darkMode, toggleDarkMode, scrolled, heroVisible }: HeaderProps) {
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm transition-all duration-300 z-50 h-16",
      scrolled ? "shadow-md border-b border-border/40" : ""
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-2">

          {/* Title that shows/hides based on hero visibility */}
          <h2 
            className={cn(
              "text-lg font-bold text-foreground tracking-tight transition-all duration-300",
              heroVisible ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
            )}
          >
            Awesome Android Tooling
          </h2>
          
        </div>
        
        <div className="flex items-center gap-4">
          {/* Submit Tool Button - Outline Style */}
          <a 
            href="https://github.com/yogeshpaliyal/awesome-android-tooling/blob/master/CONTRIBUTING.md" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium"
            title="Submit a new tool"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14"></path>
              <path d="M5 12h14"></path>
            </svg>
            Submit Tool
          </a>
        
          <button 
            className="p-2 rounded-md hover:bg-muted transition-colors flex items-center justify-center"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}