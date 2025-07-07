import { NextResponse } from 'next/server';
import { createLastfmClient } from '@/lib/lastfm';

export async function GET() {
  try {
    const client = createLastfmClient();
    const data = await client.getRecentTracks(20); // Get last 20 tracks
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch recent tracks:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch recent tracks' },
      { status: 500 }
    );
  }
}