'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { BarChart3, Calendar, Heart, Tag } from 'lucide-react';
import { 
  useRecentTracks, 
  useTopArtists, 
  useLovedTracks,
  useGenreAnalysis
} from '@/hooks/useLastfmData';
import { LastfmPeriod } from '@/types/lastfm';
import ArtistBarChart from '@/components/MusicVisualization/ArtistBarChart';
import NowPlayingCompact from '@/components/MusicVisualization/NowPlayingCompact';
import GenreChart from '@/components/MusicVisualization/GenreChart';
import TimePeriodSelector from '@/components/MusicVisualization/TimePeriodSelector';

export default function MusicPanel() {
  const [selectedPeriod, setSelectedPeriod] = useState<LastfmPeriod>('1month');
  const { nowPlaying } = useRecentTracks();
  const { artists, loading: artistsLoading } = useTopArtists(selectedPeriod, 50);
  const { tracks: lovedTracks, loading: lovedLoading } = useLovedTracks(6);
  const { genres, loading: genresLoading } = useGenreAnalysis(selectedPeriod);


  return (
    <div className="max-w-6xl">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-orbitron font-bold text-3xl mb-6 text-game-green"
      >
        MUSIC STATS
      </motion.h2>

      {/* Unified Time Period Selector */}
      <TimePeriodSelector 
        selectedPeriod={selectedPeriod} 
        onPeriodChange={setSelectedPeriod} 
      />

      <div className="space-y-6">
        {/* Now Playing - Compact */}
        {nowPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <NowPlayingCompact track={nowPlaying} />
          </motion.div>
        )}

        {/* Genre Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-game-dark rounded-lg border border-game-border p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Tag className="w-6 h-6 text-game-green" />
            <h3 className="font-orbitron font-bold text-xl text-white">Genre Distribution</h3>
          </div>

          {genresLoading ? (
            <div className="text-game-text">
              <p>Analyzing your music taste...</p>
              <p className="text-xs mt-2 text-game-text/60">This may take a moment on first load</p>
            </div>
          ) : genres.length > 0 ? (
            <GenreChart genres={genres} maxGenres={8} />
          ) : (
            <div className="text-game-text">
              <p>Genre analysis temporarily unavailable</p>
              <p className="text-xs mt-2 text-game-text/60">Try selecting a different time period or refresh in a few minutes</p>
            </div>
          )}
        </motion.div>

        {/* Top Artists with Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-game-dark rounded-lg border border-game-border p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-game-green" />
            <h3 className="font-orbitron font-bold text-xl text-white">Top Artists</h3>
          </div>

          {artistsLoading ? (
            <div className="text-game-text">Loading artists...</div>
          ) : artists.length > 0 ? (
            <ArtistBarChart artists={artists} maxArtists={10} />
          ) : (
            <div className="text-game-text">No data for this period</div>
          )}
        </motion.div>

        {/* Loved Tracks */}
        {lovedTracks.length > 0 && !lovedLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-game-dark rounded-lg border border-game-border p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-red-400" />
              <h3 className="font-orbitron font-bold text-xl text-white">Recent Loves</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {lovedTracks.map((track, index) => (
                <motion.div
                  key={`${track.name}-${track.date.uts}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="bg-game-panel rounded-lg p-3 border border-game-border hover:border-red-400/30 transition-all group"
                >
                  <p className="text-sm font-medium text-white truncate group-hover:text-red-400 transition-colors">
                    {track.name}
                  </p>
                  <p className="text-xs text-game-text truncate">
                    {track.artist.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Music Discovery Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-game-dark rounded-lg border border-game-border p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-game-blue" />
            <h3 className="font-orbitron font-bold text-xl text-white">Coming Soon</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-game-text">
            <div className="bg-game-panel/50 rounded-lg p-4 border border-game-border">
              <p className="font-mono text-game-green mb-1">Listening Trends</p>
              <p className="text-xs">Weekly play count charts & listening patterns over time</p>
            </div>
            <div className="bg-game-panel/50 rounded-lg p-4 border border-game-border">
              <p className="font-mono text-purple-400 mb-1">Discovery Score</p>
              <p className="text-xs">New vs familiar music ratio & exploration metrics</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}