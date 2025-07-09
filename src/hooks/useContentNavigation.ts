import { useEffect, useRef, useCallback } from 'react';

interface UseContentNavigationProps {
  isActive: boolean;
  onNavigate?: (index: number) => void;
}

export function useContentNavigation({ isActive, onNavigate }: UseContentNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const focusIndexRef = useRef(0);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const elements = containerRef.current.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    return Array.from(elements) as HTMLElement[];
  }, []);

  const focusElement = useCallback((index: number) => {
    const elements = getFocusableElements();
    if (elements.length === 0) return;
    
    const clampedIndex = Math.max(0, Math.min(index, elements.length - 1));
    focusIndexRef.current = clampedIndex;
    elements[clampedIndex]?.focus();
    onNavigate?.(clampedIndex);
  }, [getFocusableElements, onNavigate]);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const elements = getFocusableElements();
      if (elements.length === 0) return;

      if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        const nextIndex = (focusIndexRef.current + 1) % elements.length;
        focusElement(nextIndex);
      } else if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        const prevIndex = focusIndexRef.current === 0 
          ? elements.length - 1 
          : focusIndexRef.current - 1;
        focusElement(prevIndex);
      } else if (e.key === 'Enter' || e.key === ' ') {
        // Let the focused element handle the event
        const currentElement = elements[focusIndexRef.current];
        if (currentElement && document.activeElement !== currentElement) {
          e.preventDefault();
          currentElement.click();
        }
      }
    };

    // Track focus changes within the container
    const handleFocusIn = (e: FocusEvent) => {
      const elements = getFocusableElements();
      const target = e.target as HTMLElement;
      const index = elements.indexOf(target);
      if (index !== -1) {
        focusIndexRef.current = index;
      }
    };

    const container = containerRef.current;
    window.addEventListener('keydown', handleKeyDown);
    container?.addEventListener('focusin', handleFocusIn);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      container?.removeEventListener('focusin', handleFocusIn);
    };
  }, [isActive, focusElement, getFocusableElements]);

  // Reset focus when becoming active
  useEffect(() => {
    if (isActive && containerRef.current) {
      const elements = getFocusableElements();
      if (elements.length > 0 && !elements.includes(document.activeElement as HTMLElement)) {
        focusElement(0);
      }
    }
  }, [isActive, focusElement, getFocusableElements]);

  return {
    containerRef,
    focusElement,
    focusIndex: focusIndexRef.current
  };
}