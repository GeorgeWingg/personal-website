'use client';

import { motion } from 'framer-motion';
import { Disc3 } from 'lucide-react';
import { LastfmTrack } from '@/types/lastfm';
import { LastfmClient } from '@/lib/lastfm';

interface NowPlayingCompactProps {
  track: LastfmTrack;
}

export default function NowPlayingCompact({ track }: NowPlayingCompactProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-game-dark/80 backdrop-blur-sm rounded-lg border border-game-green/30 p-3 shadow-[0_0_15px_rgba(140,255,140,0.1)]"
    >
      <div className="flex items-center gap-3">
        <Disc3 className="w-5 h-5 text-game-green animate-spin-slow flex-shrink-0" />
        
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {track.image && track.image[1] && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={LastfmClient.getImageUrl(track.image, 'medium')}
                alt={`${track.album['#text']} cover`}
                className="w-10 h-10 rounded shadow-lg"
              />
            </>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {track.name}
            </p>
            <p className="text-xs text-game-text truncate">
              {track.artist['#text']} • {track.album['#text']}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-game-green rounded-full animate-pulse" />
          <span className="text-xs text-game-green font-mono">NOW</span>
        </div>
      </div>
    </motion.div>
  );
}