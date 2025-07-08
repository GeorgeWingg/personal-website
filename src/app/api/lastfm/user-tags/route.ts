import { NextResponse } from 'next/server';
import { createLastfmClient } from '@/lib/lastfm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    
    const client = createLastfmClient();
    const tags = await client.getUserTopTags(limit);
    
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Failed to fetch user tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user tags' },
      { status: 500 }
    );
  }
}