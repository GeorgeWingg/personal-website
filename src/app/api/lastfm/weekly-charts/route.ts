import { NextResponse } from 'next/server';
import { createLastfmClient } from '@/lib/lastfm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = createLastfmClient();
    const chartList = await client.getWeeklyChartList();
    
    return NextResponse.json(chartList);
  } catch (error) {
    console.error('Failed to fetch weekly charts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weekly charts' },
      { status: 500 }
    );
  }
}