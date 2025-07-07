'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export type MenuOption = 'about' | 'projects' | 'now' | 'music' | 'contact';

interface GameMenuProps {
  activeOption: MenuOption;
  onSelectOption: (option: MenuOption) => void;
}

interface MenuItem {
  id: MenuOption;
  label: string;
  description: string;
}

const menuItems: MenuItem[] = [
  { id: 'about', label: 'ABOUT', description: 'Who I am' },
  { id: 'projects', label: 'PROJECTS', description: 'What I\'m building' },
  { id: 'now', label: 'NOW', description: 'Current focus' },
  { id: 'music', label: 'MUSIC', description: 'What I\'m listening to' },
  { id: 'contact', label: 'CONTACT', description: 'Get in touch' },
];

export default function GameMenu({ activeOption, onSelectOption }: GameMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<MenuOption | null>(null);

  // Keyboard navigation
  useEffect(() => {
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
  }, [activeOption, onSelectOption]);

  return (
    <div className="w-full h-full bg-game-panel border-r border-game-border p-6 flex flex-col">
      <h2 className="font-orbitron font-bold text-sm text-game-text mb-8 tracking-wider">
        MAIN MENU
      </h2>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeOption === item.id;
          const isHovered = hoveredItem === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onSelectOption(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative w-full text-left p-4 rounded-lg transition-all duration-200 focus:outline-none"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background glow for active item */}
              {isActive && (
                <motion.div
                  key={`active-${item.id}`}
                  className="absolute inset-0 bg-game-green/20 rounded-lg border border-game-green/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              
              {/* Hover glow */}
              {isHovered && !isActive && (
                <motion.div
                  className="absolute inset-0 bg-game-green/10 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              )}
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className={`font-orbitron font-bold text-lg mb-1 transition-colors ${
                  isActive ? 'text-game-green' : 'text-white'
                }`}>
                  {item.label}
                </h3>
                <p className={`text-sm transition-colors ${
                  isActive ? 'text-game-green/80' : 'text-game-text'
                }`}>
                  {item.description}
                </p>
              </div>
              
              {/* Selection indicator */}
              {isActive && (
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-game-green rounded-r"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
      
      {/* Version info */}
      <div className="mt-auto pt-6 border-t border-game-border">
        <p className="text-xs text-game-text/50 font-mono">v0.2.0</p>
      </div>
    </div>
  );
}