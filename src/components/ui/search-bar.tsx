import React from "react"
import { Input } from "./input"
import { cn } from "@/lib/utils"

interface SearchBarProps extends React.ComponentPropsWithoutRef<typeof Input> {
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SearchBar({ className, onChange, ...props }: SearchBarProps) {
  return (
    <div className={cn("relative w-full", className)}>
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
      <Input
        className="pl-9 py-6 h-12 text-md"
        placeholder="Search tools..."
        onChange={onChange}
        {...props}
      />
    </div>
  )
}