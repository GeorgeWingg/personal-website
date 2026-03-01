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
      className="bg-black/60 backdrop-blur-sm rounded-sm border border-cyber-blue/30 p-3 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
    >
      <div className="flex items-center gap-3">
        <Disc3 className="w-5 h-5 text-cyber-blue animate-spin-slow flex-shrink-0" />
        
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {track.image && track.image[1] && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={LastfmClient.getImageUrl(track.image, 'medium')}
                alt={`${track.album['#text']} cover`}
                className="w-10 h-10 rounded-sm shadow-lg"
              />
            </>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]">
              {track.name}
            </p>
            <p className="text-xs text-terminal-text truncate">
              {track.artist['#text']} • {track.album['#text']}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-pulse shadow-[0_0_5px_#00f0ff]" />
          <span className="text-xs text-cyber-blue font-mono">NOW</span>
        </div>
      </div>
    </motion.div>
  );
}