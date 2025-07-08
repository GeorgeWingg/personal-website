'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface GenreData {
  name: string;
  count: number;
}

interface GenreChartProps {
  genres: GenreData[];
  maxGenres?: number;
}

export default function GenreChart({ genres, maxGenres = 8 }: GenreChartProps) {
  const genreData = useMemo(() => {
    const topGenres = genres.slice(0, maxGenres);
    
    if (topGenres.length === 0) return [];

    const total = topGenres.reduce((sum, genre) => sum + genre.count, 0);
    
    return topGenres.map((genre, index) => ({
      name: genre.name,
      count: genre.count,
      percentage: (genre.count / total) * 100,
      color: getGenreColor(index)
    }));
  }, [genres, maxGenres]);

  if (genreData.length === 0) {
    return <div className="text-game-text">No genre data available</div>;
  }

  return (
    <div className="space-y-4">
      {/* Horizontal bar chart */}
      <div className="space-y-2">
        {genreData.map((genre, index) => (
          <motion.div
            key={genre.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-white capitalize">
                {genre.name}
              </span>
              <span className="text-xs text-game-text">
                {genre.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="relative h-8 bg-game-dark rounded-lg overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-lg"
                style={{ backgroundColor: genre.color }}
                initial={{ width: 0 }}
                animate={{ width: `${genre.percentage}%` }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.05,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6">
        {genreData.map((genre, index) => (
          <motion.div
            key={genre.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className="flex items-center gap-2"
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: genre.color }}
            />
            <span className="text-xs text-game-text capitalize truncate">
              {genre.name}
            </span>
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