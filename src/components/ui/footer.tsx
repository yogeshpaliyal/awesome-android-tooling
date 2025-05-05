import React from "react"
import { cn } from "@/lib/utils"

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Footer({ className, ...props }: FooterProps) {
  return (
    <footer className={cn("w-full border-t bg-background py-8", className)} {...props}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-primary">About</h3>
            <p className="text-sm text-muted-foreground">
              A curated collection of Android development tools to help you build, test, and optimize your Android applications.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-primary">Links</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://developer.android.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Android Developers
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/topics/android-library" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Android Libraries on GitHub
                </a>
              </li>
              <li>
                <a 
                  href="https://android-arsenal.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Android Arsenal
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-primary">Community</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://github.com/yogeshpaliyal/awesome-android-tooling" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a 
                  href="https://stackoverflow.com/questions/tagged/android" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Stack Overflow
                </a>
              </li>
              <li>
                <a 
                  href="https://reddit.com/r/androiddev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  r/androiddev
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Awesome Android Tooling. All rights reserved.
          </p>
          <p className="text-sm text-primary font-medium mt-2 md:mt-0">
            Made by Yogesh Paliyal with <span className="text-red-500">❤️</span> from India 🇮🇳
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a 
              href="https://github.com/yogeshpaliyal/awesome-android-tooling" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
            </a>
            <a 
              href="https://x.com/yogeshpaliyal" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a 
              href="https://linkedin.com/in/yogeshpaliyal" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                <circle cx="4" cy="4" r="2"></circle>
                <rect width="4" height="12" x="2" y="9"></rect>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              </svg>
            </a>
            <a 
              href="https://us.posthog.com/shared/HBqMzu0dnxLYZAMjdFcmLdcFIrkKUQ" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              title="View Analytics"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart">
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}