'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [contentFocusIndex, setContentFocusIndex] = useState(0);
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
        return <NowPanel isActive={isContentActive} />;
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
    setContentFocusIndex(0); // Reset content focus when changing panels
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
      <div className="h-full flex relative">
        {/* Menu - 1/4 width */}
        <div className={`w-1/4 min-w-[250px] h-full transition-all ${
          focusArea === 'menu' ? 'ring-2 ring-white/20 ring-inset' : ''
        }`}>
          <GameMenu 
            activeOption={activeOption} 
            onSelectOption={handleMenuSelect}
            isFocused={focusArea === 'menu'}
          />
        </div>
        
        {/* Content - 3/4 width */}
        <div 
          ref={contentRef}
          className={`flex-1 h-full p-6 pb-20 transition-all ${
            focusArea === 'content' ? 'ring-2 ring-white/20 ring-inset' : ''
          }`}
        >
          <ContentPanel isActive={true}>
            {renderPanel()}
          </ContentPanel>
        </div>
        
        {/* Link Dock */}
        <LinkDock />
      </div>
    </GameFrame>
  );
}