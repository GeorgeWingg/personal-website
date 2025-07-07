export interface LastfmImage {
  '#text': string;
  size: 'small' | 'medium' | 'large' | 'extralarge';
}

export interface LastfmArtist {
  '#text': string;
  mbid?: string;
}

export interface LastfmAlbum {
  '#text': string;
  mbid?: string;
}

export interface LastfmDate {
  uts: string;
  '#text': string;
}

export interface LastfmTrack {
  name: string;
  mbid?: string;
  url: string;
  streamable: string;
  artist: LastfmArtist;
  album: LastfmAlbum;
  image: LastfmImage[];
  date?: LastfmDate;
  '@attr'?: {
    nowplaying: 'true';
  };
}

export interface LastfmRecentTracksAttr {
  user: string;
  totalPages: string;
  page: string;
  perPage: string;
  total: string;
}

export interface LastfmRecentTracksResponse {
  recenttracks: {
    track: LastfmTrack[];
    '@attr': LastfmRecentTracksAttr;
  };
}

export interface LastfmTopArtist {
  name: string;
  playcount: string;
  listeners?: string;
  mbid?: string;
  url: string;
  streamable: string;
  image: LastfmImage[];
  '@attr'?: {
    rank: string;
  };
}

export interface LastfmTopArtistsResponse {
  topartists: {
    artist: LastfmTopArtist[];
    '@attr': {
      user: string;
      totalPages: string;
      page: string;
      perPage: string;
      total: string;
    };
  };
}

export interface LastfmTopTrack {
  name: string;
  duration: string;
  playcount: string;
  listeners?: string;
  mbid?: string;
  url: string;
  streamable: {
    '#text': string;
    fulltrack: string;
  };
  artist: {
    name: string;
    mbid?: string;
    url: string;
  };
  image: LastfmImage[];
  '@attr'?: {
    rank: string;
  };
}

export interface LastfmTopTracksResponse {
  toptracks: {
    track: LastfmTopTrack[];
    '@attr': {
      user: string;
      totalPages: string;
      page: string;
      perPage: string;
      total: string;
    };
  };
}

export type LastfmPeriod = 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';

export interface LastfmError {
  error: number;
  message: string;
}