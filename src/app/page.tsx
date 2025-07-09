'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import GameFrame from '@/components/GameUI/GameFrame';
import GameMenu, { MenuOption } from '@/components/GameUI/GameMenu';
import ContentPanel from '@/components/GameUI/ContentPanel';
import LinkDock from '@/components/GameUI/LinkDock';
import AboutPanel from '@/components/Panels/AboutPanel';
import ProjectsPanel from '@/components/Panels/ProjectsPanel';
import NowPanel from '@/components/Panels/NowPanel';
import MusicPanel from '@/components/Panels/MusicPanel';
import ContactPanel from '@/components/Panels/ContactPanel';

type FocusArea = 'menu' | 'content';

export default function Home() {
  const [activeOption, setActiveOption] = useState<MenuOption>('about');
  const [focusArea, setFocusArea] = useState<FocusArea>('menu');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Sync with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as MenuOption;
      if (hash && ['about', 'projects', 'now', 'music', 'contact'].includes(hash)) {
        setActiveOption(hash);
      }
    };
    
    // Check initial hash
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPanel = () => {
    const isContentActive = focusArea === 'content';
    
    switch (activeOption) {
      case 'about':
        return <AboutPanel isActive={isContentActive} />;
      case 'projects':
        return <ProjectsPanel isActive={isContentActive} />;
      case 'now':
        return <NowPanel />;
      case 'music':
        return <MusicPanel isActive={isContentActive} />;
      case 'contact':
        return <ContactPanel isActive={isContentActive} />;
      default:
        return <AboutPanel isActive={isContentActive} />;
    }
  };

  // Handle menu selection with URL update
  const handleMenuSelect = (option: MenuOption) => {
    setActiveOption(option);
    window.location.hash = option;
    setMobileMenuOpen(false); // Close mobile menu on selection
  };

  // Global keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Arrow Left/Right to switch focus areas
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusArea('menu');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusArea('content');
        // Focus first element in content when switching
        if (contentRef.current) {
          const focusableElements = contentRef.current.querySelectorAll(
            'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length > 0) {
            (focusableElements[0] as HTMLElement).focus();
          }
        }
      }
      
      // Handle Escape to return to menu
      if (e.key === 'Escape' && focusArea === 'content') {
        e.preventDefault();
        setFocusArea('menu');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusArea]);

  return (
    <GameFrame>
      <div className="h-full flex flex-col">
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center justify-between p-4 bg-game-panel border-b border-game-border">
          <h2 className="font-orbitron font-bold text-lg text-white">MENU</h2>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-game-dark border border-game-border hover:border-game-green transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex min-h-0 relative">
          {/* Mobile menu overlay */}
          {mobileMenuOpen && (
            <div 
              className="md:hidden absolute inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
          
          {/* Menu - responsive width */}
          <div className={`
            absolute md:relative
            ${mobileMenuOpen ? 'left-0' : '-left-full'}
            md:left-0
            w-3/4 sm:w-1/2 md:w-1/4 
            min-w-[250px] h-full 
            transition-all duration-300 ease-in-out
            z-50 md:z-auto
            ${focusArea === 'menu' ? 'ring-2 ring-white/20 ring-inset' : ''}
          `}>
            <GameMenu 
              activeOption={activeOption} 
              onSelectOption={handleMenuSelect}
              isFocused={focusArea === 'menu'}
            />
          </div>
          
          {/* Content - responsive padding */}
          <div 
            ref={contentRef}
            className={`
              flex-1 h-full 
              p-4 md:p-6 
              overflow-y-auto transition-all 
              ${focusArea === 'content' ? 'ring-2 ring-white/20 ring-inset' : ''}
            `}
          >
            <ContentPanel isActive={true}>
              {renderPanel()}
            </ContentPanel>
          </div>
        </div>
        
        {/* Link Dock - responsive */}
        <LinkDock />
      </div>
    </GameFrame>
  );
}