import { useState, useEffect } from 'react';
import { 
  LastfmRecentTracksResponse, 
  LastfmTopArtistsResponse,
  LastfmTrack,
  LastfmTopArtist,
  LastfmPeriod,
  LastfmUserInfo,
  LastfmWeeklyChartListResponse,
  LastfmWeeklyArtistChartResponse,
  LastfmLovedTracksResponse,
  LastfmWeeklyChart,
  LastfmWeeklyArtist,
  LastfmLovedTrack,
  LastfmUserTopTagsResponse,
  LastfmTag
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

interface UseUserInfoResult {
  userInfo: LastfmUserInfo['user'] | null;
  loading: boolean;
  error: Error | null;
}

export function useUserInfo(): UseUserInfoResult {
  const [userInfo, setUserInfo] = useState<LastfmUserInfo['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/lastfm/user-info');
        
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        
        const data: LastfmUserInfo = await response.json();
        setUserInfo(data.user);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return { userInfo, loading, error };
}

interface UseWeeklyChartsResult {
  charts: LastfmWeeklyChart[];
  loading: boolean;
  error: Error | null;
}

export function useWeeklyCharts(): UseWeeklyChartsResult {
  const [charts, setCharts] = useState<LastfmWeeklyChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/lastfm/weekly-charts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch weekly charts');
        }
        
        const data: LastfmWeeklyChartListResponse = await response.json();
        setCharts(data.weeklychartlist.chart);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchCharts();
  }, []);

  return { charts, loading, error };
}

interface UseWeeklyArtistChartResult {
  artists: LastfmWeeklyArtist[];
  loading: boolean;
  error: Error | null;
}

export function useWeeklyArtistChart(from?: string, to?: string): UseWeeklyArtistChartResult {
  const [artists, setArtists] = useState<LastfmWeeklyArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (from) params.append('from', from);
        if (to) params.append('to', to);
        
        const response = await fetch(`/api/lastfm/weekly-artist-chart?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch weekly artist chart');
        }
        
        const data: LastfmWeeklyArtistChartResponse = await response.json();
        setArtists(data.weeklyartistchart.artist);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [from, to]);

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

interface UseUserTopTagsResult {
  tags: LastfmTag[];
  loading: boolean;
  error: Error | null;
}

export function useUserTopTags(limit: number = 50): UseUserTopTagsResult {
  const [tags, setTags] = useState<LastfmTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/lastfm/user-tags?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user tags');
        }
        
        const data: LastfmUserTopTagsResponse = await response.json();
        setTags(data.toptags.tag);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [limit]);

  return { tags, loading, error };
}

interface GenreData {
  name: string;
  count: number;
}

interface UseGenreAnalysisResult {
  genres: GenreData[];
  loading: boolean;
  error: Error | null;
}

export function useGenreAnalysis(period: LastfmPeriod): UseGenreAnalysisResult {
  const [genres, setGenres] = useState<GenreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const cacheKey = `lastfm-genres-${period}`;
    const cacheExpiry = 60 * 60 * 1000; // 1 hour in milliseconds

    const fetchGenres = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;
          
          if (age < cacheExpiry) {
            // Use cached data
            setGenres(data);
            setLoading(false);
            
            // Optionally fetch fresh data in background
            if (age > cacheExpiry / 2) { // If older than 30 minutes
              fetch(`/api/lastfm/genre-analysis?period=${period}`)
                .then(res => res.json())
                .then(freshData => {
                  if (freshData.genres) {
                    localStorage.setItem(cacheKey, JSON.stringify({
                      data: freshData.genres,
                      timestamp: Date.now()
                    }));
                    setGenres(freshData.genres);
                  }
                })
                .catch(() => {}); // Silently fail background update
            }
            return;
          }
        }

        // No cache or expired, fetch fresh data
        setLoading(true);
        const response = await fetch(`/api/lastfm/genre-analysis?period=${period}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch genre analysis');
        }
        
        const data = await response.json();
        const genresData = data.genres || [];
        
        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify({
          data: genresData,
          timestamp: Date.now()
        }));
        
        setGenres(genresData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        
        // Try to use stale cache on error
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data } = JSON.parse(cached);
          setGenres(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [period]);

  return { genres, loading, error };
}