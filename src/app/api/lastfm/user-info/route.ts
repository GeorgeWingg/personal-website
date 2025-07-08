import { NextResponse } from 'next/server';
import { createLastfmClient } from '@/lib/lastfm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = createLastfmClient();
    const userInfo = await client.getUserInfo();
    
    return NextResponse.json(userInfo);
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user info' },
      { status: 500 }
    );
  }
}