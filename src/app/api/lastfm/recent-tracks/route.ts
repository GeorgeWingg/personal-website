import { NextResponse } from 'next/server';
import { createLastfmClient } from '@/lib/lastfm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.max(1, Math.min(50, Number(searchParams.get('limit')) || 20));

    const client = createLastfmClient();
    const data = await client.getRecentTracks(limit);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch recent tracks:', error);

    return NextResponse.json(
      { error: 'Failed to fetch recent tracks' },
      { status: 500 }
    );
  }
}
