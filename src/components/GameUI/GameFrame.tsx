'use client';

import { motion } from 'framer-motion';

interface GameFrameProps {
  children: React.ReactNode;
}

export default function GameFrame({ children }: GameFrameProps) {
  return (
    <div className="min-h-screen bg-game-black flex items-center justify-center p-2 md:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-7xl h-[95vh] md:h-[90vh] max-h-[900px]"
      >
        {/* Outer bezel */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl" />
        
        {/* Inner bezel with metallic effect */}
        <div className="absolute inset-2 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-xl" />
        </div>
        
        {/* Main content area */}
        <div className="absolute inset-4 bg-game-dark rounded-lg shadow-game-depth overflow-hidden flex flex-col">
          {/* Title bar */}
          <div className="h-12 bg-game-panel border-b border-game-border flex items-center px-4 md:px-6 flex-shrink-0">
            <h1 className="font-orbitron font-bold text-lg md:text-xl tracking-wider text-game-green">
              GEORGE WING
            </h1>
            <div className="ml-auto flex gap-1 md:gap-2">
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-game-red animate-pulse" />
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-game-green" />
            </div>
          </div>
          
          {/* Content container */}
          <div className="flex-1 min-h-0">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}