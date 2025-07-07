'use client';

import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

const artists = ['Aphex Twin', 'Khruangbin', 'LCD Soundsystem', 'Caribou', 'Daft Punk', 'Bladee'];

export default function MusicPanel() {
  return (
    <div className="max-w-3xl">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-orbitron font-bold text-3xl mb-8 text-game-green"
      >
        MUSIC
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="p-6 bg-game-dark rounded-lg border border-game-border">
          <div className="flex items-center gap-3 mb-4">
            <Music className="w-6 h-6 text-game-green animate-pulse" />
            <h3 className="font-orbitron font-bold text-xl text-white">Coming Soon</h3>
          </div>
          <p className="text-game-text mb-6">
            In the near future this section will pull my listening stats from
            Last.fm and render some tasty visualizations. Until then, here are a
            few artists on repeat:
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {artists.map((artist, index) => (
              <motion.div
                key={artist}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="p-3 bg-game-panel rounded-lg border border-game-border hover:border-game-green/50 hover:shadow-game-glow transition-all duration-300"
              >
                <p className="text-white font-medium">{artist}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-4 bg-game-panel/50 rounded-lg border border-game-border"
        >
          <p className="text-sm text-game-text">
            Future features: Live listening data • Top tracks visualization • 
            Genre analysis • Listening history timeline
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}