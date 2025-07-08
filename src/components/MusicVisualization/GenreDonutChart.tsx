'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';

interface GenreData {
  name: string;
  count: number;
}

interface GenreDonutChartProps {
  genres: GenreData[];
  maxGenres?: number;
}

export default function GenreDonutChart({ genres, maxGenres = 8 }: GenreDonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Helper function to create Last.fm tag URL
  const getLastFmTagUrl = (genreName: string): string => {
    const formattedTag = genreName.toLowerCase().replace(/\s+/g, '+');
    return `https://www.last.fm/tag/${formattedTag}`;
  };
  
  const chartData = useMemo(() => {
    const topGenres = genres.slice(0, maxGenres);
    if (topGenres.length === 0) return { segments: [], total: 0 };

    const total = topGenres.reduce((sum, genre) => sum + genre.count, 0);
    let cumulativePercentage = 0;
    
    const segments = topGenres.map((genre, index) => {
      const percentage = (genre.count / total) * 100;
      const startAngle = (cumulativePercentage / 100) * 360 - 90; // Start from top
      cumulativePercentage += percentage;
      const endAngle = (cumulativePercentage / 100) * 360 - 90;
      
      return {
        name: genre.name,
        count: genre.count,
        percentage,
        startAngle,
        endAngle,
        color: getGenreColor(index),
      };
    });

    return { segments, total };
  }, [genres, maxGenres]);

  if (chartData.segments.length === 0) {
    return <div className="text-game-text">No genre data available</div>;
  }

  const size = 240;
  const center = size / 2;
  const outerRadius = 90;
  const innerRadius = 54; // 40% of outer

  // Helper to create SVG path for donut segment
  const createPath = (startAngle: number, endAngle: number): string => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = center + outerRadius * Math.cos(startAngleRad);
    const y1 = center + outerRadius * Math.sin(startAngleRad);
    const x2 = center + outerRadius * Math.cos(endAngleRad);
    const y2 = center + outerRadius * Math.sin(endAngleRad);
    
    const x3 = center + innerRadius * Math.cos(endAngleRad);
    const y3 = center + innerRadius * Math.sin(endAngleRad);
    const x4 = center + innerRadius * Math.cos(startAngleRad);
    const y4 = center + innerRadius * Math.sin(startAngleRad);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return `
      M ${x1} ${y1}
      A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Donut Chart */}
      <div className="relative">
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="w-80 h-80 md:w-96 md:h-96"
        >
          {/* Background ring */}
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
          
          {/* Segments */}
          <g>
            {chartData.segments.map((segment, index) => (
              <motion.path
                key={segment.name}
                d={createPath(segment.startAngle, segment.endAngle)}
                fill={segment.color}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => window.open(getLastFmTagUrl(segment.name), '_blank')}
                style={{
                  filter: hoveredIndex === index ? 'brightness(1.2) drop-shadow(0 0 10px currentColor)' : '',
                  transformOrigin: `${center}px ${center}px`,
                  cursor: 'pointer',
                }}
              />
            ))}
          </g>
          
          {/* Center content */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <text
              x={center}
              y={center - 10}
              textAnchor="middle"
              className="fill-white font-orbitron font-bold capitalize"
              style={{ fontSize: chartData.segments[0].name.length > 10 ? '14px' : '18px' }}
            >
              {chartData.segments[0].name.length > 12 
                ? chartData.segments[0].name.slice(0, 12) + '...' 
                : chartData.segments[0].name}
            </text>
            <text
              x={center}
              y={center + 10}
              textAnchor="middle"
              className="fill-game-text font-mono text-xs"
            >
              Top Genre • {chartData.segments[0].percentage.toFixed(1)}%
            </text>
          </motion.g>
        </svg>
        
        {/* Hover tooltip */}
        <AnimatePresence>
          {hoveredIndex !== null && (() => {
            const segment = chartData.segments[hoveredIndex];
            const midAngle = (segment.startAngle + segment.endAngle) / 2;
            const tooltipRadius = outerRadius + 60; // Increased from 40 to 60 for more spacing
            const angleRad = (midAngle * Math.PI) / 180;
            const x = center + tooltipRadius * Math.cos(angleRad);
            const y = center + tooltipRadius * Math.sin(angleRad);
            
            return (
              <motion.div
                key={`tooltip-${hoveredIndex}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="bg-game-dark border border-game-green/50 rounded-lg p-3 shadow-lg pointer-events-none z-10 whitespace-nowrap"
              >
                <p className="font-medium text-white capitalize">
                  {segment.name}
                </p>
                <p className="text-sm text-game-text">
                  {segment.percentage.toFixed(1)}% • {segment.count.toLocaleString()} plays
                </p>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2 w-full max-w-4xl">
        {chartData.segments.map((segment, index) => (
          <motion.div
            key={segment.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all cursor-pointer ${
              hoveredIndex === index ? 'bg-game-dark' : ''
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => window.open(getLastFmTagUrl(segment.name), '_blank')}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: segment.color,
                filter: hoveredIndex === index ? 'brightness(1.2)' : '',
              }}
            />
            <p className="text-xs font-medium text-white capitalize text-center">
              {segment.name}
            </p>
            <p className="text-xs text-game-text">
              {segment.percentage.toFixed(1)}%
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function getGenreColor(index: number): string {
  const colors = [
    '#8CFF8C', // game-green
    '#00B4D8', // game-blue
    '#FF1744', // game-red
    '#FFD60A', // yellow
    '#B794F4', // purple
    '#F687B3', // pink
    '#4ECDC4', // teal
    '#FF6B6B', // coral
  ];
  return colors[index % colors.length];
}