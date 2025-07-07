'use client';

import { useState, useEffect } from 'react';
import GameFrame from '@/components/GameUI/GameFrame';
import GameMenu, { MenuOption } from '@/components/GameUI/GameMenu';
import ContentPanel from '@/components/GameUI/ContentPanel';
import LinkDock from '@/components/GameUI/LinkDock';
import AboutPanel from '@/components/Panels/AboutPanel';
import ProjectsPanel from '@/components/Panels/ProjectsPanel';
import NowPanel from '@/components/Panels/NowPanel';
import MusicPanel from '@/components/Panels/MusicPanel';
import ContactPanel from '@/components/Panels/ContactPanel';

export default function Home() {
  const [activeOption, setActiveOption] = useState<MenuOption>('about');
  
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
    switch (activeOption) {
      case 'about':
        return <AboutPanel />;
      case 'projects':
        return <ProjectsPanel />;
      case 'now':
        return <NowPanel />;
      case 'music':
        return <MusicPanel />;
      case 'contact':
        return <ContactPanel />;
      default:
        return <AboutPanel />;
    }
  };

  // Handle menu selection with URL update
  const handleMenuSelect = (option: MenuOption) => {
    setActiveOption(option);
    window.location.hash = option;
  };

  return (
    <GameFrame>
      <div className="h-full flex relative">
        {/* Menu - 1/4 width */}
        <div className="w-1/4 min-w-[250px] h-full">
          <GameMenu activeOption={activeOption} onSelectOption={handleMenuSelect} />
        </div>
        
        {/* Content - 3/4 width */}
        <div className="flex-1 h-full p-6 pb-20">
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