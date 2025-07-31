import { NextResponse } from 'next/server';
import { createLastfmClient } from '@/lib/lastfm';
import { LastfmPeriod } from '@/types/lastfm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') || '1month') as LastfmPeriod;
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    
    const client = createLastfmClient();
    const data = await client.getTopAlbums(period, limit);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch top albums:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch top albums' },
      { status: 500 }
    );
  }
}