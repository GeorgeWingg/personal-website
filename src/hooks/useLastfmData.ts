import { useState, useEffect } from 'react';
import { 
  LastfmRecentTracksResponse, 
  LastfmTopArtistsResponse,
  LastfmTrack,
  LastfmTopArtist,
  LastfmPeriod
} from '@/types/lastfm';

interface UseRecentTracksResult {
  tracks: LastfmTrack[];
  nowPlaying: LastfmTrack | null;
  loading: boolean;
  error: Error | null;
}

export function useRecentTracks(): UseRecentTracksResult {
  const [tracks, setTracks] = useState<LastfmTrack[]>([]);
  const [nowPlaying, setNowPlaying] = useState<LastfmTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/lastfm/recent-tracks');
        
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
    
    // Refresh every minute to catch now playing updates
    const interval = setInterval(fetchTracks, 60000);
    
    return () => clearInterval(interval);
  }, []);

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