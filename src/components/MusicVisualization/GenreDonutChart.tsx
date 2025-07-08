'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState, useRef, useEffect, useCallback } from 'react';

interface GenreData {
  name: string;
  count: number;
}

interface TooltipPosition {
  x: number;
  y: number;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

interface TooltipDimensions {
  width: number;
  height: number;
}

// Custom hook for tooltip measurement and positioning
function useTooltipPositioning() {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltipDimensions, setTooltipDimensions] = useState<TooltipDimensions | null>(null);

  const measureTooltip = useCallback(() => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      setTooltipDimensions({ width: rect.width, height: rect.height });
    }
  }, []);

  const calculatePosition = useCallback((
    anchorX: number,
    anchorY: number,
    containerRect: DOMRect,
    tooltipDims: TooltipDimensions,
    preferredPlacement: 'top' | 'bottom' | 'left' | 'right' = 'top'
  ): TooltipPosition => {
    const padding = 8; // Padding from edges
    const gap = 4; // Gap between anchor and tooltip (reduced since we already offset from donut)
    
    // Try placements in order of preference
    const placements: Array<{ placement: TooltipPosition['placement'], x: number, y: number }> = [
      {
        placement: preferredPlacement,
        x: preferredPlacement === 'left' ? anchorX - tooltipDims.width - gap :
           preferredPlacement === 'right' ? anchorX + gap :
           anchorX - tooltipDims.width / 2,
        y: preferredPlacement === 'top' ? anchorY - tooltipDims.height - gap :
           preferredPlacement === 'bottom' ? anchorY + gap :
           anchorY - tooltipDims.height / 2
      },
      // Fallback placements
      {
        placement: 'top',
        x: anchorX - tooltipDims.width / 2,
        y: anchorY - tooltipDims.height - gap
      },
      {
        placement: 'bottom',
        x: anchorX - tooltipDims.width / 2,
        y: anchorY + gap
      },
      {
        placement: 'right',
        x: anchorX + gap,
        y: anchorY - tooltipDims.height / 2
      },
      {
        placement: 'left',
        x: anchorX - tooltipDims.width - gap,
        y: anchorY - tooltipDims.height / 2
      }
    ];

    // Check each placement for collision with container bounds
    for (const placement of placements) {
      const wouldFitHorizontally = placement.x >= padding && 
                                   placement.x + tooltipDims.width <= containerRect.width - padding;
      const wouldFitVertically = placement.y >= padding && 
                                 placement.y + tooltipDims.height <= containerRect.height - padding;
      
      if (wouldFitHorizontally && wouldFitVertically) {
        return placement;
      }
    }

    // If nothing fits perfectly, return the preferred placement clamped to bounds
    const fallback = placements[0];
    return {
      placement: fallback.placement,
      x: Math.max(padding, Math.min(fallback.x, containerRect.width - tooltipDims.width - padding)),
      y: Math.max(padding, Math.min(fallback.y, containerRect.height - tooltipDims.height - padding))
    };
  }, []);

  return {
    tooltipRef,
    containerRef,
    tooltipDimensions,
    measureTooltip,
    calculatePosition
  };
}

interface GenreDonutChartProps {
  genres: GenreData[];
  maxGenres?: number;
}

export default function GenreDonutChart({ genres, maxGenres = 8 }: GenreDonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
  const {
    tooltipRef,
    containerRef,
    tooltipDimensions,
    measureTooltip,
    calculatePosition
  } = useTooltipPositioning();
  const svgRef = useRef<SVGSVGElement>(null);
  
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

  const size = 240;
  const center = size / 2;
  const outerRadius = 90;
  const innerRadius = 54; // 40% of outer

  // Function to calculate optimal anchor point on segment edge
  const getSegmentAnchorPoint = useCallback((segment: typeof chartData.segments[0]) => {
    const midAngle = (segment.startAngle + segment.endAngle) / 2;
    const angleRad = (midAngle * Math.PI) / 180;
    
    // Calculate point outside the donut for tooltip anchor
    const tooltipOffset = 20; // Distance from outer edge in SVG units
    const anchorRadius = outerRadius + tooltipOffset;
    const anchorX = center + anchorRadius * Math.cos(angleRad);
    const anchorY = center + anchorRadius * Math.sin(angleRad);
    
    // Determine preferred placement based on segment position
    const normalizedAngle = ((midAngle % 360) + 360) % 360;
    let preferredPlacement: 'top' | 'bottom' | 'left' | 'right' = 'top';
    
    if (normalizedAngle >= 315 || normalizedAngle < 45) {
      preferredPlacement = 'right';
    } else if (normalizedAngle >= 45 && normalizedAngle < 135) {
      preferredPlacement = 'bottom';
    } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
      preferredPlacement = 'left';
    } else {
      preferredPlacement = 'top';
    }
    
    return { anchorX, anchorY, preferredPlacement };
  }, [center, outerRadius]);

  // Handle hover with simplified positioning logic
  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index);
    
    if (containerRef.current) {
      const segment = chartData.segments[index];
      const midAngle = (segment.startAngle + segment.endAngle) / 2;
      const angleRad = (midAngle * Math.PI) / 180;
      
      // Get container dimensions
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate the center of the rendered donut
      const renderCenterX = containerRect.width / 2;
      const renderCenterY = containerRect.height / 2;
      
      // Calculate the rendered radius (accounting for CSS scaling)
      // The SVG is 240x240 but renders at 320x320 (w-80)
      const scale = containerRect.width / size;
      const renderOuterRadius = outerRadius * scale;
      
      // Position tooltip outside the donut with a gap
      const tooltipDistance = renderOuterRadius + (30 * scale); // 30px gap in SVG units
      const anchorX = renderCenterX + tooltipDistance * Math.cos(angleRad);
      const anchorY = renderCenterY + tooltipDistance * Math.sin(angleRad);
      
      // Determine preferred placement based on angle
      const normalizedAngle = ((midAngle % 360) + 360) % 360;
      let preferredPlacement: 'top' | 'bottom' | 'left' | 'right' = 'top';
      
      if (normalizedAngle >= 315 || normalizedAngle < 45) {
        preferredPlacement = 'right';
      } else if (normalizedAngle >= 45 && normalizedAngle < 135) {
        preferredPlacement = 'bottom';
      } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
        preferredPlacement = 'left';
      } else {
        preferredPlacement = 'top';
      }

      // Simple positioning without complex calculations
      if (tooltipDimensions) {
        let x = anchorX;
        let y = anchorY;
        
        // Adjust position based on placement to prevent overlap
        if (preferredPlacement === 'left') {
          x -= tooltipDimensions.width;
          y -= tooltipDimensions.height / 2;
        } else if (preferredPlacement === 'right') {
          y -= tooltipDimensions.height / 2;
        } else if (preferredPlacement === 'top') {
          x -= tooltipDimensions.width / 2;
          y -= tooltipDimensions.height;
        } else {
          x -= tooltipDimensions.width / 2;
        }
        
        // Ensure tooltip stays within container bounds
        const padding = 8;
        x = Math.max(padding, Math.min(x, containerRect.width - tooltipDimensions.width - padding));
        y = Math.max(padding, Math.min(y, containerRect.height - tooltipDimensions.height - padding));
        
        setTooltipPosition({ x, y, placement: preferredPlacement });
      } else {
        // Initial position (centered on anchor point)
        setTooltipPosition({ 
          x: anchorX - 100, // Approximate half width
          y: anchorY - 30,  // Approximate half height
          placement: preferredPlacement 
        });
        
        // Trigger measurement
        setTimeout(measureTooltip, 16);
      }
    }
  }, [chartData.segments, tooltipDimensions, size, outerRadius, measureTooltip, containerRef]);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
    setTooltipPosition(null);
  }, []);

  // Recalculate position when tooltip dimensions are measured
  useEffect(() => {
    if (hoveredIndex !== null && tooltipDimensions && containerRef.current) {
      const segment = chartData.segments[hoveredIndex];
      const midAngle = (segment.startAngle + segment.endAngle) / 2;
      const angleRad = (midAngle * Math.PI) / 180;
      
      // Get container dimensions
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate the center of the rendered donut
      const renderCenterX = containerRect.width / 2;
      const renderCenterY = containerRect.height / 2;
      
      // Calculate the rendered radius
      const scale = containerRect.width / size;
      const renderOuterRadius = outerRadius * scale;
      
      // Position tooltip outside the donut
      const tooltipDistance = renderOuterRadius + (30 * scale);
      const anchorX = renderCenterX + tooltipDistance * Math.cos(angleRad);
      const anchorY = renderCenterY + tooltipDistance * Math.sin(angleRad);
      
      // Determine placement
      const normalizedAngle = ((midAngle % 360) + 360) % 360;
      let preferredPlacement: 'top' | 'bottom' | 'left' | 'right' = 'top';
      
      if (normalizedAngle >= 315 || normalizedAngle < 45) {
        preferredPlacement = 'right';
      } else if (normalizedAngle >= 45 && normalizedAngle < 135) {
        preferredPlacement = 'bottom';
      } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
        preferredPlacement = 'left';
      } else {
        preferredPlacement = 'top';
      }
      
      // Calculate final position
      let x = anchorX;
      let y = anchorY;
      
      if (preferredPlacement === 'left') {
        x -= tooltipDimensions.width;
        y -= tooltipDimensions.height / 2;
      } else if (preferredPlacement === 'right') {
        y -= tooltipDimensions.height / 2;
      } else if (preferredPlacement === 'top') {
        x -= tooltipDimensions.width / 2;
        y -= tooltipDimensions.height;
      } else {
        x -= tooltipDimensions.width / 2;
      }
      
      // Keep within bounds
      const padding = 8;
      x = Math.max(padding, Math.min(x, containerRect.width - tooltipDimensions.width - padding));
      y = Math.max(padding, Math.min(y, containerRect.height - tooltipDimensions.height - padding));
      
      setTooltipPosition({ x, y, placement: preferredPlacement });
    }
  }, [tooltipDimensions, hoveredIndex, chartData.segments, size, outerRadius, containerRef]);

  // Early return after all hooks
  if (chartData.segments.length === 0) {
    return <div className="text-game-text">No genre data available</div>;
  }

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
      <div ref={containerRef} className="relative">
        <svg 
          ref={svgRef}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  delay: 0.3 + index * 0.15,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
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
            transition={{ delay: 0.6 }}
          >
            <text
              x={center}
              y={center - 6}
              textAnchor="middle"
              className="fill-white font-orbitron font-bold capitalize"
              style={{ fontSize: chartData.segments[0].name.length > 8 ? '11px' : '13px' }}
            >
              {chartData.segments[0].name.length > 10 
                ? chartData.segments[0].name.slice(0, 10) + '...' 
                : chartData.segments[0].name}
            </text>
            <text
              x={center}
              y={center + 8}
              textAnchor="middle"
              className="fill-game-text font-mono"
              style={{ fontSize: '10px' }}
            >
              Top Genre • {chartData.segments[0].percentage.toFixed(1)}%
            </text>
          </motion.g>
        </svg>
        
        {/* Hover tooltip with geometry-first positioning */}
        <AnimatePresence>
          {hoveredIndex !== null && tooltipPosition && (
            <motion.div
              ref={tooltipRef}
              key={`tooltip-${hoveredIndex}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
              }}
              className="bg-game-dark border border-game-green/50 rounded-lg p-3 shadow-lg pointer-events-none z-50 whitespace-nowrap"
              onAnimationComplete={measureTooltip}
            >
              <p className="font-medium text-white capitalize">
                {chartData.segments[hoveredIndex].name}
              </p>
              <p className="text-sm text-game-text">
                {chartData.segments[hoveredIndex].percentage.toFixed(1)}% • {chartData.segments[hoveredIndex].count.toLocaleString()} plays
              </p>
            </motion.div>
          )}
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
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
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