import { NextResponse } from 'next/server';
import { createLastfmClient } from '@/lib/lastfm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    
    const client = createLastfmClient();
    const lovedTracks = await client.getLovedTracks(limit, page);
    
    return NextResponse.json(lovedTracks);
  } catch (error) {
    console.error('Failed to fetch loved tracks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loved tracks' },
      { status: 500 }
    );
  }
}