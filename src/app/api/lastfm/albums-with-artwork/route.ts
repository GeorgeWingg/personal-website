import { NextResponse } from 'next/server';
import { createLastfmClient } from '@/lib/lastfm';
import { LastfmPeriod } from '@/types/lastfm';

export interface AlbumWithArtwork {
  name: string;
  artist: string;
  playcount: string;
  rank: string;
  url: string;
  artwork: string | null;
  mbid?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') || '1month') as LastfmPeriod;
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    
    // Get album data from Last.fm
    const client = createLastfmClient();
    const lastfmData = await client.getTopAlbums(period, limit);
    
    if (!lastfmData.topalbums?.album) {
      return NextResponse.json({ albums: [] });
    }

    // Transform Last.fm data using their provided images directly
    const albumsWithArtwork = lastfmData.topalbums.album.map(album => {
      // Get the largest available image from Last.fm (300x300)
      const largeImage = album.image?.find(img => img.size === 'extralarge') || 
                         album.image?.find(img => img.size === 'large') ||
                         album.image?.[album.image.length - 1];
      
      return {
        name: album.name,
        artist: album.artist.name,
        playcount: album.playcount,
        rank: album['@attr']?.rank || '0',
        url: album.url,
        mbid: album.mbid,
        artwork: largeImage?.['#text'] || null,
      };
    });
    
    return NextResponse.json({ 
      albums: albumsWithArtwork,
      period,
      total: lastfmData.topalbums['@attr'].total
    });
    
  } catch (error) {
    console.error('Failed to fetch albums with artwork:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch albums with artwork' },
      { status: 500 }
    );
  }
}