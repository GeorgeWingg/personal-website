'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { ExternalLink, Music, Play } from 'lucide-react';
import { AlbumWithArtwork } from '@/app/api/lastfm/albums-with-artwork/route';

interface AlbumGridProps {
  albums: AlbumWithArtwork[];
  loading?: boolean;
  gridSize?: 'auto' | 'fixed-3x3' | 'fixed-5x5';
  maxAlbums?: number;
}

interface AlbumCardProps {
  album: AlbumWithArtwork;
  index: number;
  onClick: () => void;
}

function AlbumCard({ album, index, onClick }: AlbumCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    console.log(`Image failed for ${album.name} by ${album.artist}`);
    
    // Don't retry 404s, just show fallback immediately
    setImageError(true);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: Math.min(index * 0.03, 0.3), // Cap delay at 300ms
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-game-dark rounded-lg border border-game-border overflow-hidden cursor-pointer transition-all duration-200 hover:border-game-green/50 hover:shadow-lg game-focus aspect-square"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Open ${album.name} by ${album.artist} on Last.fm`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Album Artwork */}
      <div className="relative w-full h-full">
        {album.artwork && !imageError ? (
          <>
            <Image
              src={album.artwork}
              alt={`${album.name} by ${album.artist}`}
              fill
              className={`object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
              loading={index < 6 ? 'eager' : 'lazy'}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
              quality={90}
              priority={index < 4}
            />
            
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-game-panel animate-pulse flex items-center justify-center">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-game-panel/50 to-game-dark/50" />
                  <Music className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-game-text/40" />
                </div>
              </div>
            )}
          </>
        ) : (
          /* Fallback for missing artwork */
          <div className="absolute inset-0 bg-gradient-to-br from-game-panel to-game-dark flex items-center justify-center">
            <Music className="w-12 h-12 text-game-text/60" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        {/* Hover content */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
          <div className="text-white">
            <h3 className="font-medium text-sm leading-tight truncate mb-1">
              {album.name}
            </h3>
            <p className="text-xs text-gray-300 truncate mb-2">
              {album.artist}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-game-green font-mono">
                #{album.rank}
              </span>
              <div className="flex items-center gap-1">
                <Play className="w-3 h-3" />
                <span>{parseInt(album.playcount).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* External link icon */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-6 h-6 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
            <ExternalLink className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Rank indicator (always visible on mobile) */}
        <div className="absolute top-2 left-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
          <div className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs font-mono text-game-green">
            #{album.rank}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AlbumGridSkeleton({ gridSize }: { gridSize: AlbumGridProps['gridSize'] }) {
  const getSkeletonCount = () => {
    switch (gridSize) {
      case 'fixed-3x3': return 9;
      case 'fixed-5x5': return 25;
      default: return 12; // Auto mode
    }
  };

  const skeletonCount = getSkeletonCount();

  return (
    <div className={`
      grid gap-3 md:gap-4 
      ${gridSize === 'fixed-3x3' ? 'grid-cols-3' : 
        gridSize === 'fixed-5x5' ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5' :
        'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
      }
    `}>
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <div 
          key={index}
          className="aspect-square bg-game-dark rounded-lg border border-game-border animate-pulse flex items-center justify-center"
        >
          <Music className="w-8 h-8 text-game-text/40" />
        </div>
      ))}
    </div>
  );
}

export default function AlbumGrid({ 
  albums, 
  loading = false, 
  gridSize = 'auto',
  maxAlbums 
}: AlbumGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // For auto mode, calculate the best grid size to avoid orphans
  const getAutoAlbumCount = (totalAlbums: number) => {
    if (gridSize !== 'auto') return maxAlbums || totalAlbums;
    
    // Numbers that divide evenly across our responsive grid columns (2,3,4,5,6)
    // LCM of 2,3,4,5,6 is 60, but let's use practical multiples
    const preferredGrids = [
      24, // Perfect: 24÷2=12, 24÷3=8, 24÷4=6, 24÷6=4 rows
      18, // Good: 18÷2=9, 18÷3=6, 18÷6=3 rows (not great for 4,5 cols)
      12, // Great: 12÷2=6, 12÷3=4, 12÷4=3, 12÷6=2 rows  
      10, // Good: 10÷2=5, 10÷5=2 rows (not great for 3,4,6 cols)
      6,  // Perfect: 6÷2=3, 6÷3=2, 6÷6=1 rows
    ];
    
    // Find the largest grid that fits within our album count
    for (const size of preferredGrids) {
      if (size <= totalAlbums) return size;
    }
    
    return Math.min(totalAlbums, 6); // Fallback to max 6 albums
  };
  
  const displayAlbums = albums.slice(0, getAutoAlbumCount(albums.length));

  const handleAlbumClick = (album: AlbumWithArtwork) => {
    window.open(album.url, '_blank', 'noopener,noreferrer');
  };

  const getGridClasses = () => {
    switch (gridSize) {
      case 'fixed-3x3':
        return 'grid-cols-3 max-w-md mx-auto'; // Always 3 columns
      case 'fixed-5x5':
        return 'grid-cols-5 max-w-4xl mx-auto'; // Always 5 columns, even on mobile
      default: // auto
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      <AnimatePresence mode="wait">
        {loading && displayAlbums.length === 0 ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlbumGridSkeleton gridSize={gridSize} />
          </motion.div>
        ) : displayAlbums.length > 0 ? (
          <motion.div
            key="albums"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`grid gap-3 md:gap-4 ${getGridClasses()}`}
          >
            {displayAlbums.map((album, index) => (
              <AlbumCard
                key={`${album.artist}-${album.name}-${album.rank}`}
                album={album}
                index={index}
                onClick={() => handleAlbumClick(album)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <Music className="w-12 h-12 text-game-text/40 mx-auto mb-4" />
            <p className="text-game-text">No albums found for this period</p>
            <p className="text-xs text-game-text/60 mt-2">
              Try selecting a different time period
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}