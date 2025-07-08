'use client';

import { motion } from 'framer-motion';
import { LastfmTopArtist } from '@/types/lastfm';

interface ArtistBarChartProps {
  artists: LastfmTopArtist[];
  maxArtists?: number;
}

export default function ArtistBarChart({ artists, maxArtists = 10 }: ArtistBarChartProps) {
  const topArtists = artists.slice(0, maxArtists);
  const maxPlaycount = Math.max(...topArtists.map(a => parseInt(a.playcount)));

  return (
    <div className="space-y-3">
      {topArtists.map((artist, index) => {
        const percentage = (parseInt(artist.playcount) / maxPlaycount) * 100;
        
        return (
          <motion.div
            key={artist.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-game-green/60 w-6">
                  #{index + 1}
                </span>
                <span className="text-white font-medium truncate max-w-[200px]">
                  {artist.name}
                </span>
              </div>
              <span className="text-sm text-game-text ml-2">
                {artist.playcount} plays
              </span>
            </div>
            
            <div className="relative h-6 bg-game-dark rounded overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-game-green/80 to-game-green/40 rounded"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.05,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <div className="absolute inset-0 bg-game-gloss opacity-30" />
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}