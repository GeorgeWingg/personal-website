'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ContentPanelProps {
  children: React.ReactNode;
  isActive: boolean;
}

export default function ContentPanel({ children, isActive }: ContentPanelProps) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key="content"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ 
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="h-full w-full"
        >
          <div className="h-full bg-game-panel-gradient rounded-lg border border-game-border shadow-game-panel relative overflow-hidden">
            {/* Gloss overlay */}
            <div className="absolute inset-0 bg-game-gloss pointer-events-none" />
            
            {/* Content container with scrolling */}
            <div className="relative h-full overflow-y-auto custom-scrollbar p-4 md:p-8">
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}