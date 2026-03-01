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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.15, // Faster transition
            ease: "linear" 
          }}
          className="h-full w-full bg-transparent relative"
        >
          {/* Content container with scrolling */}
          <div className="h-full overflow-y-auto custom-scrollbar p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}