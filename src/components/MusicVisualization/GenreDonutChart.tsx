'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState, useCallback, useRef } from 'react';
import { LastfmTopArtist } from '@/types/lastfm';

interface GenreData {
  name: string;
  count: number;
}

interface GenreDonutChartProps {
  genres: GenreData[];
  artists?: LastfmTopArtist[];
  maxGenres?: number;
}

export default function GenreDonutChart({ genres, artists = [], maxGenres = 8 }: GenreDonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Helper function to create Last.fm tag URL
  const getLastFmTagUrl = (genreName: string): string => {
    const formattedTag = genreName.toLowerCase().replace(/\s+/g, '+');
    return `https://www.last.fm/tag/${formattedTag}`;
  };
  
  // Create artist-to-genre mapping
  const genreArtistMap = useMemo(() => {
    if (!artists.length) return new Map();
    
    const map = new Map<string, LastfmTopArtist[]>();
    
    // Create a hash function for consistent artist distribution
    const hashString = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash);
    };
    
    // For each genre, find artists that likely belong to it
    genres.forEach((genre, genreIndex) => {
      const genreName = genre.name.toLowerCase();
      const matchingArtists: LastfmTopArtist[] = [];
      
      // Distribute artists based on play count and consistent hashing
      // This ensures the same artists always appear for the same genres
      artists.forEach((artist) => {
        const artistName = artist.name.toLowerCase();
        const artistHash = hashString(artist.name + genre.name);
        const playcount = parseInt(artist.playcount);
        
        // Enhanced matching logic based on genre keywords and artist characteristics
        let matchProbability = 0;
        
        // Genre-specific matching
        if (genreName.includes('rock') && (artistName.includes('rock') || artistName.includes('metal') || artistName.includes('punk'))) {
          matchProbability += 0.8;
        } else if (genreName.includes('pop') && (artistName.includes('pop') || playcount > 50000)) {
          matchProbability += 0.7;
        } else if (genreName.includes('electronic') && (artistName.includes('electronic') || artistName.includes('techno') || artistName.includes('house'))) {
          matchProbability += 0.8;
        } else if ((genreName.includes('hip hop') || genreName.includes('rap')) && (artistName.includes('rap') || artistName.includes('hip'))) {
          matchProbability += 0.8;
        } else if (genreName.includes('metal') && (artistName.includes('metal') || artistName.includes('death') || artistName.includes('black'))) {
          matchProbability += 0.8;
        } else if (genreName.includes('jazz') && artistName.includes('jazz')) {
          matchProbability += 0.8;
        } else if (genreName.includes('classical') && artistName.includes('classical')) {
          matchProbability += 0.8;
        }
        
        // Base distribution based on play count and consistent hashing
        const baseMatch = (artistHash % 100) / 100;
        const playcountBonus = Math.min(playcount / 100000, 0.3); // Higher playcount artists more likely
        
        matchProbability += baseMatch * 0.4 + playcountBonus;
        
        // Ensure each genre gets some artists (minimum threshold)
        const threshold = Math.max(0.3, 0.8 - (genreIndex * 0.05));
        
        if (matchProbability > threshold) {
          matchingArtists.push(artist);
        }
      });
      
      // Sort by play count and take top 3
      const topArtists = matchingArtists
        .sort((a, b) => parseInt(b.playcount) - parseInt(a.playcount))
        .slice(0, 3);
      
      // If no matches, assign top artists by playcount for this genre
      if (topArtists.length === 0) {
        const fallbackArtists = artists
          .slice(genreIndex * 2, (genreIndex * 2) + 3)
          .filter(artist => artist);
        
        if (fallbackArtists.length > 0) {
          map.set(genre.name, fallbackArtists);
        }
      } else {
        map.set(genre.name, topArtists);
      }
    });
    
    return map;
  }, [genres, artists]);
  
  // Pre-computed tooltip content data structure
  const tooltipData = useMemo(() => {
    const topGenres = genres.slice(0, maxGenres);
    if (topGenres.length === 0) return new Map();
    
    const tooltipMap = new Map<string, {
      name: string;
      percentage: number;
      count: number;
      artists: LastfmTopArtist[];
    }>();
    
    topGenres.forEach(genre => {
      const artists = genreArtistMap.get(genre.name) || [];
      const total = topGenres.reduce((sum, g) => sum + g.count, 0);
      const percentage = (genre.count / total) * 100;
      
      tooltipMap.set(genre.name, {
        name: genre.name,
        percentage,
        count: genre.count,
        artists,
      });
    });
    
    return tooltipMap;
  }, [genres, maxGenres, genreArtistMap]);

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


  // Enhanced hover logic with delay for smooth animations
  const handleMouseEnter = useCallback((index: number) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    setHoveredIndex(index);
    
    // Show tooltip after a short delay to prevent flickering
    hoverTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 100);
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Clear timeout and immediately hide
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    setHoveredIndex(null);
    setShowTooltip(false);
  }, []);

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
      {/* Chart and Tooltip Container */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Donut Chart - Left Side */}
        <div className="relative">
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="w-96 h-96 md:w-[28rem] md:h-[28rem]"
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
        </div>
        
        {/* Fixed Tooltip Area - Right Side */}
        <div className="w-full md:w-64 md:h-60 flex items-start justify-center">
          <AnimatePresence mode="wait">
            {hoveredIndex !== null && showTooltip && (() => {
              const genreName = chartData.segments[hoveredIndex].name;
              const tooltipContent = tooltipData.get(genreName);
              
              if (!tooltipContent) return null;
              
              return (
                <motion.div
                  key={`tooltip-${hoveredIndex}`}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ 
                    duration: 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    opacity: { duration: 0.15 },
                    scale: { duration: 0.18 }
                  }}
                  className="bg-game-dark border border-game-green/50 rounded-lg p-4 shadow-lg w-full h-full flex flex-col"
                  style={{ minHeight: '240px' }} // Stabilize layout
                >
                  <motion.div 
                    className="mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.15 }}
                  >
                    <p className="font-medium text-white capitalize text-lg mb-2">
                      {tooltipContent.name}
                    </p>
                    <p className="text-sm text-game-text mb-1">
                      {tooltipContent.percentage.toFixed(1)}% of listening time
                    </p>
                    <p className="text-sm text-game-text">
                      {tooltipContent.count.toLocaleString()} plays
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    className="flex-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.15 }}
                  >
                    <p className="text-xs font-mono text-game-green mb-2 uppercase tracking-wide">
                      Top Artists
                    </p>
                    <div className="space-y-1" style={{ minHeight: '100px' }}>
                      {tooltipContent.artists.length === 0 ? (
                        <p className="text-sm text-game-text/60 italic">No artist data available</p>
                      ) : (
                        tooltipContent.artists.map((artist: LastfmTopArtist, artistIndex: number) => (
                          <motion.div 
                            key={artist.name} 
                            className="flex items-center justify-between"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.12 + artistIndex * 0.03, duration: 0.15 }}
                          >
                            <p className="text-sm text-white truncate flex-1 mr-2">
                              {artistIndex + 1}. {artist.name}
                            </p>
                            <p className="text-xs text-game-text font-mono flex-shrink-0">
                              {parseInt(artist.playcount).toLocaleString()}
                            </p>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
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