'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
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
                <span className="text-xs font-mono text-cyber-blue/60 w-6">
                  #{index + 1}
                </span>
                <a
                  href={artist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 text-white font-medium hover:text-cyber-blue transition-colors duration-200 truncate max-w-[200px]"
                  aria-label={`View ${artist.name} on Last.fm`}
                >
                  <span className="truncate">
                    {artist.name}
                  </span>
                  <ExternalLink 
                    size={12} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" 
                  />
                </a>
              </div>
              <span className="text-sm text-terminal-text ml-2">
                {artist.playcount} plays
              </span>
            </div>
            
            <div className="relative h-6 bg-white/5 rounded-sm overflow-hidden border border-white/5">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyber-blue/80 to-cyber-purple/60 rounded-sm shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.05,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <div className="absolute inset-0 bg-white/10 opacity-30" />
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}