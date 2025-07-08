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

export interface LastfmUserInfo {
  user: {
    name: string;
    realname?: string;
    url: string;
    image: LastfmImage[];
    country: string;
    age: string;
    gender: string;
    subscriber: string;
    playcount: string;
    playlists: string;
    bootstrap: string;
    registered: {
      unixtime: string;
      '#text': number;
    };
  };
}

export interface LastfmWeeklyChart {
  from: string;
  to: string;
  '#text'?: string;
}

export interface LastfmWeeklyChartListResponse {
  weeklychartlist: {
    chart: LastfmWeeklyChart[];
    '@attr': {
      user: string;
    };
  };
}

export interface LastfmWeeklyArtist {
  name: string;
  mbid?: string;
  playcount: string;
  url: string;
  '@attr': {
    rank: string;
  };
}

export interface LastfmWeeklyArtistChartResponse {
  weeklyartistchart: {
    artist: LastfmWeeklyArtist[];
    '@attr': {
      user: string;
      from: string;
      to: string;
    };
  };
}

export interface LastfmWeeklyTrack {
  name: string;
  mbid?: string;
  playcount: string;
  artist: {
    '#text': string;
    mbid?: string;
  };
  url: string;
  '@attr': {
    rank: string;
  };
}

export interface LastfmWeeklyTrackChartResponse {
  weeklytrackchart: {
    track: LastfmWeeklyTrack[];
    '@attr': {
      user: string;
      from: string;
      to: string;
    };
  };
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

export interface LastfmTag {
  name: string;
  count: string;
  url: string;
}

export interface LastfmUserTopTagsResponse {
  toptags: {
    tag: LastfmTag[];
    '@attr': {
      user: string;
    };
  };
}

export interface LastfmArtistTopTagsResponse {
  toptags: {
    tag: LastfmTag[];
    '@attr': {
      artist: string;
    };
  };
}