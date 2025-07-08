import { NextResponse } from 'next/server';
import { createLastfmClient } from '@/lib/lastfm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from') || undefined;
    const to = searchParams.get('to') || undefined;
    
    const client = createLastfmClient();
    const artistChart = await client.getWeeklyArtistChart(from, to);
    
    return NextResponse.json(artistChart);
  } catch (error) {
    console.error('Failed to fetch weekly artist chart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weekly artist chart' },
      { status: 500 }
    );
  }
}