'use client';

import { motion } from 'framer-motion';
import { Grid3X3, Grid2X2, LayoutGrid } from 'lucide-react';

export type GridSizeOption = 'auto' | 'fixed-3x3' | 'fixed-5x5';

interface GridSizeSelectorProps {
  selectedSize: GridSizeOption;
  onSizeChange: (size: GridSizeOption) => void;
}

interface GridOption {
  id: GridSizeOption;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const gridOptions: GridOption[] = [
  {
    id: 'auto',
    label: 'AUTO',
    icon: LayoutGrid,
    description: 'Responsive grid'
  },
  {
    id: 'fixed-3x3',
    label: '3×3',
    icon: Grid2X2,
    description: '9 albums'
  },
  {
    id: 'fixed-5x5',
    label: '5×5',
    icon: Grid3X3,
    description: '25 albums'
  }
];

export default function GridSizeSelector({ selectedSize, onSizeChange }: GridSizeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-game-text font-orbitron tracking-wider hidden sm:block">
        GRID
      </span>
      
      <div className="flex bg-game-dark border border-game-border rounded-lg p-1 min-w-0">
        {gridOptions.map((option) => {
          const Icon = option.icon;
          const isActive = selectedSize === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => onSizeChange(option.id)}
              className={`
                relative px-3 py-2 sm:py-1.5 text-xs font-orbitron font-bold tracking-wider
                transition-all duration-200 rounded-md flex items-center gap-2 min-h-[36px] sm:min-h-0
                touch-manipulation active:scale-95
                ${isActive 
                  ? 'text-white' 
                  : 'text-game-text hover:text-white active:text-white'
                }
              `}
              title={option.description}
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  layoutId="grid-selector"
                  className="absolute inset-0 bg-game-green/20 border border-game-green/40 rounded-md"
                  transition={{ 
                    duration: 0.2, 
                    ease: [0.25, 0.46, 0.45, 0.94] 
                  }}
                />
              )}
              
              {/* Content */}
              <div className="relative z-10 flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{option.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}