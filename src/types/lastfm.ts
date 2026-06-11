export interface LastfmImage {
  '#text': string;
  size: 'small' | 'medium' | 'large' | 'extralarge';
}

export interface LastfmArtist {
  // Standard responses use '#text'; extended=1 responses use name/url/image instead
  '#text'?: string;
  name?: string;
  url?: string;
  image?: LastfmImage[];
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

export type LastfmPeriod = 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';

export interface LastfmError {
  error: number;
  message: string;
}

export interface LastfmLovedTrack {
  name: string;
  mbid?: string;
  url: string;
  date: LastfmDate;
  artist: {
    name: string;
    mbid?: string;
    url: string;
  };
  image: LastfmImage[];
  streamable: {
    fulltrack: string;
    '#text': string;
  };
}

export interface LastfmLovedTracksResponse {
  lovedtracks: {
    track: LastfmLovedTrack[];
    '@attr': {
      user: string;
      totalPages: string;
      page: string;
      perPage: string;
      total: string;
    };
  };
}

export interface LastfmTopAlbum {
  name: string;
  playcount: string;
  mbid?: string;
  url: string;
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

export interface LastfmTopAlbumsResponse {
  topalbums: {
    album: LastfmTopAlbum[];
    '@attr': {
      user: string;
      totalPages: string;
      page: string;
      perPage: string;
      total: string;
    };
  };
}
