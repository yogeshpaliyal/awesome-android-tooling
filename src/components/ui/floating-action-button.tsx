// filepath: /Users/yogeshchoudhary/MyProjects/awesome-android-tooling/src/components/ui/floating-action-button.tsx
import { useState, useEffect } from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  visible?: boolean;
}

export function FloatingActionButton({ onClick, visible = true }: FloatingActionButtonProps) {
  const [isVisible, setIsVisible] = useState(visible);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Determine if scrolling up
      const isScrollUp = currentScrollY < lastScrollY;
      setIsScrollingUp(isScrollUp);
      
      // Update the last scroll position
      setLastScrollY(currentScrollY);
      
      // Show button when scrolling down and past the initial view
      setIsVisible(visible && (isScrollUp || currentScrollY < 200));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, visible]);

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full p-3 shadow-lg transition-all duration-300 flex items-center justify-center ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      } hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50`}
      aria-label="Tool of the Day"
    >
      <div className="flex items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="mr-2"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="font-medium">Tool of the Day</span>
      </div>
    </button>
  );
}