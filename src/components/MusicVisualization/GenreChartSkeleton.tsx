'use client';

import { motion } from 'framer-motion';

export default function GenreChartSkeleton() {
  const size = 240;
  const center = size / 2;
  const outerRadius = 90;
  const innerRadius = 54;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Skeleton Donut */}
      <div className="relative">
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="w-80 h-80 md:w-96 md:h-96"
        >
          {/* Background rings */}
          <circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-game-border"
          />
          <circle
            cx={center}
            cy={center}
            r={innerRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-game-border"
          />
          
          {/* Animated loading ring */}
          <motion.circle
            cx={center}
            cy={center}
            r={(outerRadius + innerRadius) / 2}
            fill="none"
            stroke="currentColor"
            strokeWidth={outerRadius - innerRadius}
            strokeDasharray="60 240"
            className="text-game-border/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ originX: `${center}px`, originY: `${center}px` }}
          />
          
          {/* Center text skeleton */}
          <g className="animate-pulse">
            <rect
              x={center - 20}
              y={center - 15}
              width="40"
              height="20"
              rx="4"
              className="fill-game-border"
            />
            <rect
              x={center - 25}
              y={center + 5}
              width="50"
              height="10"
              rx="2"
              className="fill-game-border/60"
            />
          </g>
        </svg>
      </div>
      
      {/* Skeleton Legend */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2 w-full max-w-4xl">
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center gap-1 p-2"
          >
            <div className="w-3 h-3 bg-game-border rounded-full animate-pulse" />
            <div className="h-3 w-16 bg-game-border rounded animate-pulse mt-1" />
            <div className="h-2 w-10 bg-game-border/60 rounded animate-pulse mt-1" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}