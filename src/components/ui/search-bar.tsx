import React, { useState, useRef, useEffect } from "react"
import { Input } from "./input"
import { cn } from "@/lib/utils"

interface SearchBarProps extends React.ComponentPropsWithoutRef<typeof Input> {
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTagSelect?: (tag: string) => void
  selectedTag: string | null
  allTags: string[]
  popularTags: string[]
}

export function SearchBar({ 
  className, 
  onChange, 
  onTagSelect,
  selectedTag,
  allTags,
  popularTags,
  ...props 
}: SearchBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  // Close filters dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Search icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {/* Input with right padding for filter button */}
      <Input
        className="pl-9 pr-12 py-6 h-12 text-md"
        placeholder="Search tools..."
        onChange={onChange}
        {...props}
      />

      {/* Filter button */}
      <button 
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-accent transition-colors"
        onClick={() => setShowFilters(!showFilters)}
        aria-label="Filter"
        title="Filter by tags"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>

        {/* Badge indicating if a filter is active */}
        {selectedTag && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
        )}
      </button>

      {/* Filter dropdown */}
      {showFilters && (
        <div 
          ref={filtersRef}
          className="absolute z-50 top-full left-0 right-0 mt-1 p-4 bg-popover border border-border rounded-lg shadow-lg max-h-[70vh] overflow-y-auto"
        >
          {/* Selected tag section */}
          {selectedTag && (
            <div className="mb-4 pb-2 border-b">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Selected tag:</span>
                <button 
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => onTagSelect && onTagSelect(selectedTag)}
                >
                  Clear
                </button>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => onTagSelect && onTagSelect(selectedTag)}
                  className="px-3 py-1.5 rounded-md text-sm bg-primary text-primary-foreground flex items-center justify-between"
                >
                  <span>{selectedTag}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Popular tags section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Popular tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => onTagSelect && onTagSelect(tag)}
                  className={`px-3 py-1 rounded-md text-xs ${
                    selectedTag === tag 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* All tags section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">All tags ({allTags.length})</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => onTagSelect && onTagSelect(tag)}
                  className={`px-2 py-1 rounded-md text-xs text-left truncate ${
                    selectedTag === tag 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}