'use client';

import { motion } from 'framer-motion';
import { Music, Disc3, User, Clock } from 'lucide-react';
import { useRecentTracks, useTopArtists } from '@/hooks/useLastfmData';
import { LastfmClient } from '@/lib/lastfm';

export default function MusicPanel() {
  const { tracks, nowPlaying, loading: tracksLoading, error: tracksError } = useRecentTracks();
  const { artists, loading: artistsLoading, error: artistsError } = useTopArtists('1month', 8);

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="max-w-4xl">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-orbitron font-bold text-3xl mb-8 text-game-green"
      >
        MUSIC
      </motion.h2>
      
      <div className="space-y-6">
        {/* Now Playing */}
        {nowPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-game-dark rounded-lg border border-game-green/50 shadow-[0_0_20px_rgba(140,255,140,0.15)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <Disc3 className="w-6 h-6 text-game-green animate-spin-slow" />
              <h3 className="font-orbitron font-bold text-xl text-white">Now Playing</h3>
            </div>
            <div className="flex items-center gap-4">
              {nowPlaying.image && nowPlaying.image[2] && (
                <img 
                  src={LastfmClient.getImageUrl(nowPlaying.image, 'large')}
                  alt={`${nowPlaying.album['#text']} cover`}
                  className="w-16 h-16 rounded-lg"
                />
              )}
              <div>
                <p className="text-white font-bold">{nowPlaying.name}</p>
                <p className="text-game-text">{nowPlaying.artist['#text']}</p>
                <p className="text-game-text/60 text-sm">{nowPlaying.album['#text']}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Tracks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-game-dark rounded-lg border border-game-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-game-green" />
            <h3 className="font-orbitron font-bold text-xl text-white">Recent Tracks</h3>
          </div>
          
          {tracksLoading ? (
            <p className="text-game-text">Loading tracks...</p>
          ) : tracksError ? (
            <p className="text-game-red">Failed to load tracks</p>
          ) : (
            <div className="space-y-3">
              {tracks.slice(0, 5).map((track, index) => (
                <motion.div
                  key={`${track.name}-${track.date?.uts || index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-game-panel rounded-lg border border-game-border hover:border-game-green/30 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {track.image && track.image[0] && (
                      <img 
                        src={LastfmClient.getImageUrl(track.image, 'small')}
                        alt={`${track.album['#text']} cover`}
                        className="w-10 h-10 rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{track.name}</p>
                      <p className="text-game-text text-sm truncate">
                        {track.artist['#text']} • {track.album['#text']}
                      </p>
                    </div>
                  </div>
                  {track.date && (
                    <p className="text-game-text/60 text-xs ml-2 whitespace-nowrap">
                      {formatRelativeTime(track.date.uts)}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Top Artists */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-game-dark rounded-lg border border-game-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-game-green" />
            <h3 className="font-orbitron font-bold text-xl text-white">Top Artists This Month</h3>
          </div>
          
          {artistsLoading ? (
            <p className="text-game-text">Loading artists...</p>
          ) : artistsError ? (
            <p className="text-game-red">Failed to load artists</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {artists.map((artist, index) => (
                <motion.div
                  key={artist.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="p-3 bg-game-panel rounded-lg border border-game-border hover:border-game-green/50 hover:shadow-[0_0_10px_rgba(140,255,140,0.2)] transition-all duration-300 text-center"
                >
                  <p className="text-white font-medium text-sm truncate">{artist.name}</p>
                  <p className="text-game-green text-xs mt-1">{artist.playcount} plays</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Future Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-game-panel/50 rounded-lg border border-game-border"
        >
          <p className="text-sm text-game-text">
            Coming soon: Listening trends • Genre analysis • Yearly stats • Discover weekly
          </p>
        </motion.div>
      </div>
    </div>
  );
}