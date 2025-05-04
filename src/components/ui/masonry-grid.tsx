import React, { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MasonryGridProps {
  children: ReactNode
  className?: string
  gap?: string
}

export function MasonryGrid({
  children,
  className,
  gap = "1.5rem",
}: MasonryGridProps) {
  return (
    <div
      className={cn(
        "columns-1 sm:columns-1 md:columns-2 lg:columns-3 gap-6",
        className
      )}
      style={{ columnGap: gap }}
    >
      {React.Children.map(children, (child) => (
        <div className="break-inside-avoid mb-6 inline-block w-full">
          {child}
        </div>
      ))}
    </div>
  )
}