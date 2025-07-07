import {
  LastfmRecentTracksResponse,
  LastfmTopArtistsResponse,
  LastfmTopTracksResponse,
  LastfmPeriod,
  LastfmError,
} from '@/types/lastfm';

const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

interface LastfmClientConfig {
  apiKey: string;
  username: string;
}

class LastfmClient {
  private apiKey: string;
  private username: string;

  constructor(config: LastfmClientConfig) {
    this.apiKey = config.apiKey;
    this.username = config.username;
  }

  private async request<T>(params: Record<string, string>): Promise<T> {
    const queryParams = new URLSearchParams({
      ...params,
      api_key: this.apiKey,
      format: 'json',
    });

    const url = `${BASE_URL}?${queryParams.toString()}`;
    
    try {
      const response = await fetch(url, {
        next: { revalidate: 300 }, // Cache for 5 minutes
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check for Last.fm API errors
      if ('error' in data) {
        const error = data as LastfmError;
        throw new Error(`Last.fm API error: ${error.message} (${error.error})`);
      }

      return data as T;
    } catch (error) {
      console.error('Last.fm API request failed:', error);
      throw error;
    }
  }

  async getRecentTracks(limit: number = 50): Promise<LastfmRecentTracksResponse> {
    return this.request<LastfmRecentTracksResponse>({
      method: 'user.getrecenttracks',
      user: this.username,
      limit: limit.toString(),
      extended: '1', // Include extended data
    });
  }

  async getTopArtists(
    period: LastfmPeriod = '1month',
    limit: number = 12
  ): Promise<LastfmTopArtistsResponse> {
    return this.request<LastfmTopArtistsResponse>({
      method: 'user.gettopartists',
      user: this.username,
      period,
      limit: limit.toString(),
    });
  }

  async getTopTracks(
    period: LastfmPeriod = '1month',
    limit: number = 10
  ): Promise<LastfmTopTracksResponse> {
    return this.request<LastfmTopTracksResponse>({
      method: 'user.gettoptracks',
      user: this.username,
      period,
      limit: limit.toString(),
    });
  }

  // Helper to get currently playing track
  async getNowPlaying() {
    const response = await this.getRecentTracks(1);
    const track = response.recenttracks.track[0];
    
    if (track?.['@attr']?.nowplaying === 'true') {
      return track;
    }
    
    return null;
  }

  // Helper to format image URL
  static getImageUrl(images: { '#text': string; size: string }[], preferredSize: string = 'large'): string {
    const image = images.find(img => img.size === preferredSize) || images[images.length - 1];
    return image?.['#text'] || '';
  }
}

// Export a factory function to create the client
export function createLastfmClient(): LastfmClient {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;

  if (!apiKey || !username) {
    throw new Error('Missing Last.fm API configuration. Please set LASTFM_API_KEY and LASTFM_USERNAME environment variables.');
  }

  return new LastfmClient({ apiKey, username });
}

export { LastfmClient };