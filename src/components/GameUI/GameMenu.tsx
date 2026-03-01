'use client';

import { useEffect, useRef } from 'react';

export type MenuOption = 'about' | 'projects' | 'now' | 'music' | 'blog' | 'contact';

interface GameMenuProps {
  activeOption: MenuOption;
  onSelectOption: (option: MenuOption) => void;
  isFocused?: boolean;
}

interface MenuItem {
  id: MenuOption;
  label: string;
  description: string;
  index: string;
}

const menuItems: MenuItem[] = [
  { id: 'about', label: 'ABOUT', description: 'IDENTITY_CORE', index: '01' },
  { id: 'projects', label: 'PROJECTS', description: 'BUILD_LOGS', index: '02' },
  { id: 'now', label: 'NOW', description: 'CURRENT_STATUS', index: '03' },
  { id: 'music', label: 'MUSIC', description: 'AUDIO_DATA', index: '04' },
  { id: 'blog', label: 'BLOG', description: 'TRANSMISSIONS', index: '05' },
  { id: 'contact', label: 'CONTACT', description: 'COMM_LINK', index: '06' },
];

export default function GameMenu({ activeOption, onSelectOption, isFocused = true }: GameMenuProps) {
  const navRef = useRef<HTMLElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to active item
  useEffect(() => {
    if (activeButtonRef.current && navRef.current) {
      const button = activeButtonRef.current;
      const nav = navRef.current;
      const buttonTop = button.offsetTop;
      const buttonBottom = buttonTop + button.offsetHeight;
      const navScrollTop = nav.scrollTop;
      const navHeight = nav.clientHeight;
      
      if (buttonTop < navScrollTop) {
        nav.scrollTo({ top: buttonTop, behavior: 'smooth' });
      } else if (buttonBottom > navScrollTop + navHeight) {
        nav.scrollTo({ top: buttonBottom - navHeight, behavior: 'smooth' });
      }
    }
  }, [activeOption]);

  // Keyboard navigation
  useEffect(() => {
    if (!isFocused) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = menuItems.findIndex(item => item.id === activeOption);
      
      if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % menuItems.length;
        onSelectOption(menuItems[nextIndex].id);
      } else if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        const prevIndex = currentIndex === 0 ? menuItems.length - 1 : currentIndex - 1;
        onSelectOption(menuItems[prevIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeOption, onSelectOption, isFocused]);

  return (
    <div className="w-full h-full bg-black/20 backdrop-blur-md border-r border-terminal-border/50 flex flex-col font-jetbrains">
      {/* Fixed header */}
      <div className="px-6 py-4 border-b border-terminal-border/50 bg-black/40">
        <h2 className="text-[10px] tracking-widest text-terminal-text/80 uppercase flex items-center gap-2">
           <span className="w-2 h-2 bg-terminal-border rounded-full"></span>
           Index // Navigation
        </h2>
      </div>
      
      {/* Navigation */}
      <nav ref={navRef} className="flex-1 overflow-y-auto custom-scrollbar min-h-0 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeOption === item.id;
            
            return (
              <button
                key={item.id}
                ref={isActive ? activeButtonRef : null}
                onClick={() => onSelectOption(item.id)}
                className={`group relative w-full text-left px-6 py-4 transition-all duration-200 ease-out overflow-hidden ${
                  isActive 
                    ? 'bg-cyber-blue/10 border-r-2 border-cyber-blue' 
                    : 'text-terminal-text hover:text-white hover:bg-white/5'
                }`}
              >
                 {/* Hover Glow Effect */}
                 <div className={`absolute inset-0 bg-gradient-to-r from-cyber-blue/0 to-cyber-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                <div className="flex items-baseline justify-between relative z-10">
                  <div className="flex items-center gap-4">
                     <span className={`text-xs font-mono transition-colors ${isActive ? 'text-cyber-blue' : 'text-terminal-border group-hover:text-white/50'}`}>
                        {item.index}
                     </span>
                     <h3 className={`font-bold text-lg tracking-tight uppercase transition-all ${isActive ? 'text-white drop-shadow-[0_0_5px_rgba(0,240,255,0.8)] translate-x-2' : 'group-hover:translate-x-1'}`}>
                        {item.label}
                     </h3>
                  </div>
                  
                  {isActive && (
                     <span className="animate-pulse text-cyber-blue drop-shadow-[0_0_5px_#00f0ff]">
                        ●
                     </span>
                  )}
                </div>
                <p className={`text-[10px] mt-1 uppercase tracking-widest ml-9 transition-colors ${
                   isActive ? 'text-cyber-blue/70' : 'text-terminal-border group-hover:text-white/40'
                }`}>
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}