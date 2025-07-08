import { NextResponse } from 'next/server';
import { createLastfmClient } from '@/lib/lastfm';
import { LastfmPeriod } from '@/types/lastfm';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

interface GenreCount {
  [genre: string]: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') || '1month') as LastfmPeriod;
    const limit = 20; // Reduced to avoid rate limits
    
    const client = createLastfmClient();
    
    // Get top artists for the period
    const topArtistsResponse = await client.getTopArtists(period, limit);
    const artists = topArtistsResponse.topartists.artist;
    
    if (artists.length === 0) {
      return NextResponse.json({ genres: [] });
    }
    
    // Collect all genre tags from top artists
    const genreCounts: GenreCount = {};
    const tagsToFilter = [
      'seen live', 'favorites', 'favourite', 'own', 'albums i own', 
      'check out', 'unknown', 'beautiful', 'awesome', 'good', 'great',
      'love', 'loved', 'british', 'american', 'canadian', 'german',
      'swedish', 'norwegian', 'danish', 'icelandic', 'australian'
    ];
    
    // Process artists in batches for better performance
    const batchSize = 5;
    const processBatch = async (batch: typeof artists) => {
      return Promise.all(
        batch.map(async (artist) => {
          try {
            const tagsResponse = await client.getArtistTopTags(artist.name);
            const tags = tagsResponse.toptags.tag.slice(0, 5);
            
            return { artist, tags };
          } catch (error) {
            console.error(`Failed to fetch tags for ${artist.name}:`, error);
            return null;
          }
        })
      );
    };
    
    // Process all artists in batches
    for (let i = 0; i < artists.length; i += batchSize) {
      const batch = artists.slice(i, i + batchSize);
      const results = await processBatch(batch);
      
      // Process results
      for (const result of results) {
        if (!result) continue;
        
        const { artist, tags } = result;
        for (const tag of tags) {
          const tagName = tag.name.toLowerCase();
          
          // Filter out non-genre tags
          if (!tagsToFilter.some(filter => tagName.includes(filter))) {
            const weight = parseInt(artist.playcount) * (parseInt(tag.count) / 100);
            genreCounts[tag.name] = (genreCounts[tag.name] || 0) + weight;
          }
        }
      }
      
      // Rate limiting between batches (not individual requests)
      if (i + batchSize < artists.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    // Convert to array and sort by count
    const genres = Object.entries(genreCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12); // Return top 12 genres
    
    return NextResponse.json({ genres });
  } catch (error) {
    console.error('Failed to analyze genres:', error);
    return NextResponse.json(
      { error: 'Failed to analyze genres' },
      { status: 500 }
    );
  }
}