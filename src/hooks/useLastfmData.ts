import { useState, useEffect } from 'react';
import {
  LastfmRecentTracksResponse,
  LastfmTopArtistsResponse,
  LastfmTrack,
  LastfmTopArtist,
  LastfmPeriod,
  LastfmLovedTracksResponse,
  LastfmLovedTrack,
} from '@/types/lastfm';
import { AlbumWithArtwork } from '@/app/api/lastfm/albums-with-artwork/route';

interface UseRecentTracksResult {
  tracks: LastfmTrack[];
  nowPlaying: LastfmTrack | null;
  loading: boolean;
  error: Error | null;
}

export function useRecentTracks(limit: number = 20): UseRecentTracksResult {
  const [tracks, setTracks] = useState<LastfmTrack[]>([]);
  const [nowPlaying, setNowPlaying] = useState<LastfmTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/lastfm/recent-tracks?limit=${limit}`);

        if (!response.ok) {
          throw new Error('Failed to fetch recent tracks');
        }

        const data: LastfmRecentTracksResponse = await response.json();
        const trackList = data.recenttracks.track;

        // Check if first track is currently playing
        const firstTrack = trackList[0];
        if (firstTrack?.['@attr']?.nowplaying === 'true') {
          setNowPlaying(firstTrack);
          setTracks(trackList.slice(1)); // Rest of the tracks
        } else {
          setNowPlaying(null);
          setTracks(trackList);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();

    // Refresh every minute to catch now playing updates; skip polls while the
    // tab is hidden and catch up as soon as it becomes visible again
    const interval = setInterval(() => {
      if (!document.hidden) fetchTracks();
    }, 60000);
    const handleVisibility = () => {
      if (!document.hidden) fetchTracks();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [limit]);

  return { tracks, nowPlaying, loading, error };
}

interface UseTopArtistsResult {
  artists: LastfmTopArtist[];
  loading: boolean;
  error: Error | null;
}

export function useTopArtists(period: LastfmPeriod = '1month', limit: number = 12): UseTopArtistsResult {
  const [artists, setArtists] = useState<LastfmTopArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/lastfm/top-artists?period=${period}&limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch top artists');
        }
        
        const data: LastfmTopArtistsResponse = await response.json();
        setArtists(data.topartists.artist);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [period, limit]);

  return { artists, loading, error };
}

interface UseLovedTracksResult {
  tracks: LastfmLovedTrack[];
  loading: boolean;
  error: Error | null;
}

export function useLovedTracks(limit: number = 50): UseLovedTracksResult {
  const [tracks, setTracks] = useState<LastfmLovedTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/lastfm/loved-tracks?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch loved tracks');
        }
        
        const data: LastfmLovedTracksResponse = await response.json();
        setTracks(data.lovedtracks.track);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [limit]);

  return { tracks, loading, error };
}

interface UseTopAlbumsWithArtworkResult {
  albums: AlbumWithArtwork[];
  loading: boolean;
  error: Error | null;
}

export function useTopAlbumsWithArtwork(period: LastfmPeriod, limit: number = 25): UseTopAlbumsWithArtworkResult {
  const [albums, setAlbums] = useState<AlbumWithArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const cacheKey = `lastfm-albums-artwork-${period}-${limit}`;
    const cacheExpiry = 60 * 60 * 1000; // 1 hour in milliseconds

    const fetchAlbums = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;
          
          if (age < cacheExpiry) {
            // Use cached data
            setAlbums(data);
            setLoading(false);
            
            // Optionally fetch fresh data in background if cache is getting stale
            if (age > cacheExpiry / 2) { // If older than 30 minutes
              fetch(`/api/lastfm/albums-with-artwork?period=${period}&limit=${limit}`)
                .then(res => res.json())
                .then(freshData => {
                  if (freshData.albums) {
                    localStorage.setItem(cacheKey, JSON.stringify({
                      data: freshData.albums,
                      timestamp: Date.now()
                    }));
                    setAlbums(freshData.albums);
                  }
                })
                .catch(() => {}); // Silently fail background update
            }
            return;
          }
        }

        // No cache or expired, fetch fresh data
        setLoading(true);
        const response = await fetch(`/api/lastfm/albums-with-artwork?period=${period}&limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch albums with artwork');
        }
        
        const data = await response.json();
        const albumsData = data.albums || [];
        
        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify({
          data: albumsData,
          timestamp: Date.now()
        }));
        
        setAlbums(albumsData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        
        // Try to use stale cache on error
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data } = JSON.parse(cached);
          setAlbums(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [period, limit]);

  return { albums, loading, error };
}