'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function GenreChartSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Loading Container - Match chart dimensions */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Chart Area - Same size as real donut */}
        <div className="w-96 h-96 md:w-[28rem] md:h-[28rem] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 size={48} className="text-game-green" />
            </motion.div>
            <div className="text-center">
              <p className="text-lg font-orbitron font-medium text-white mb-1">
                Loading music data
              </p>
              <p className="text-sm text-game-text">
                Analyzing your listening patterns...
              </p>
            </div>
          </div>
        </div>
        
        {/* Tooltip Area - Match tooltip dimensions */}
        <div className="w-full md:w-64 md:h-60 flex items-center justify-center">
          <div className="bg-game-dark/50 border border-game-border/50 rounded-lg p-4 w-full h-full flex items-center justify-center">
            <p className="text-sm text-game-text/60 text-center">
              Genre details will appear here
            </p>
          </div>
        </div>
      </div>
      
      {/* Legend Loading */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2 w-full max-w-4xl">
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center gap-1 p-2"
          >
            <div className="w-3 h-3 bg-game-border/50 rounded-full animate-pulse" />
            <div className="h-3 w-16 bg-game-border/30 rounded animate-pulse mt-1" />
            <div className="h-2 w-10 bg-game-border/20 rounded animate-pulse mt-1" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}