'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BarChart3, ExternalLink, Heart, Tag } from 'lucide-react';
import Image from 'next/image';
import { 
  useRecentTracks, 
  useTopArtists, 
  useLovedTracks,
  useGenreAnalysis
} from '@/hooks/useLastfmData';
import { LastfmPeriod } from '@/types/lastfm';
import ArtistBarChart from '@/components/MusicVisualization/ArtistBarChart';
import NowPlayingCompact from '@/components/MusicVisualization/NowPlayingCompact';
import GenreDonutChart from '@/components/MusicVisualization/GenreDonutChart';
import GenreChartSkeleton from '@/components/MusicVisualization/GenreChartSkeleton';
import TimePeriodSelector from '@/components/MusicVisualization/TimePeriodSelector';
import { useContentNavigation } from '@/hooks/useContentNavigation';

interface MusicPanelProps {
  isActive?: boolean;
}

export default function MusicPanel({ isActive = false }: MusicPanelProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<LastfmPeriod>('1month');
  const { nowPlaying } = useRecentTracks();
  const { artists, loading: artistsLoading } = useTopArtists(selectedPeriod, 50);
  const { tracks: lovedTracks, loading: lovedLoading } = useLovedTracks(6);
  const { genres, loading: genresLoading } = useGenreAnalysis(selectedPeriod);
  
  const { containerRef } = useContentNavigation({ isActive });

  // Pre-warm cache for adjacent periods
  useEffect(() => {
    const periods: LastfmPeriod[] = ['7day', '1month', '3month'];
    periods.forEach(period => {
      if (period !== selectedPeriod) {
        const cacheKey = `lastfm-genres-${period}`;
        const cached = localStorage.getItem(cacheKey);
        if (!cached) {
          // Pre-fetch in background with low priority
          setTimeout(() => {
            fetch(`/api/lastfm/genre-analysis?period=${period}`)
              .then(res => res.json())
              .then(data => {
                if (data.genres) {
                  localStorage.setItem(cacheKey, JSON.stringify({
                    data: data.genres,
                    timestamp: Date.now()
                  }));
                }
              })
              .catch(() => {});
          }, 5000); // Wait 5 seconds before pre-fetching
        }
      }
    });
  }, []);


  return (
    <div ref={containerRef} className="max-w-6xl">
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

          {genresLoading && genres.length === 0 ? (
            <GenreChartSkeleton />
          ) : genres.length > 0 ? (
            <GenreDonutChart genres={genres} artists={artists} maxGenres={8} />
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

        {/* Last.fm Profile Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-game-dark rounded-lg border border-game-border p-6 hover:border-game-green/50 transition-all cursor-pointer group game-focus"
          onClick={() => window.open('https://www.last.fm/user/GeorgeWing', '_blank')}
          tabIndex={0}
          role="link"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              window.open('https://www.last.fm/user/GeorgeWing', '_blank');
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-game-border flex-shrink-0">
                <Image 
                  src="/profile-avatar-hd.jpg" 
                  alt="George Wing" 
                  width={96} 
                  height={96}
                  className="w-full h-full object-cover"
                  quality={100}
                />
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-xl text-white group-hover:text-game-green transition-colors">
                  View Full Profile
                </h3>
                <p className="text-sm text-game-text">
                  @GeorgeWing on Last.fm
                </p>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-game-text group-hover:text-game-green transition-colors" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}