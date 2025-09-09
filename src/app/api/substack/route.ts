import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const dynamic = 'force-dynamic';
export const revalidate = 1800; // cache 30 minutes
export const runtime = 'nodejs';

type FeedItem = {
  title?: string;
  link?: string;
  isoDate?: string;
  contentSnippet?: string;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = Math.max(1, Math.min(20, Number(url.searchParams.get('limit')) || 5));

    // Allow NEXT_PUBLIC_ fallback and optional query override for local testing
    const fromEnv = (process.env.SUBSTACK_URL || process.env.NEXT_PUBLIC_SUBSTACK_URL || '').replace(/\/$/, '');
    const fromQuery = (url.searchParams.get('baseUrl') || '').replace(/\/$/, '');
    const baseUrl = fromQuery || fromEnv;
    if (!baseUrl) {
      return NextResponse.json(
        { error: 'Missing SUBSTACK_URL env var' },
        { status: 400 }
      );
    }

    const feedUrl = `${baseUrl}/feed`;
    const parser: Parser<object, FeedItem> = new Parser({
      customFields: {
        item: [ ['content:encodedSnippet', 'contentSnippet'] ],
      },
    });

    const feed = await parser.parseURL(feedUrl);

    const items = (feed.items || [])
      .slice(0, limit)
      .map((item) => ({
        title: item.title || 'Untitled',
        link: item.link || baseUrl,
        publishedAt: item.isoDate || null,
        excerpt: (item.contentSnippet || '').replace(/\s+/g, ' ').trim(),
      }));

    return NextResponse.json({
      publication: {
        title: feed.title || 'Substack',
        homeUrl: baseUrl,
      },
      items,
    });
  } catch (err) {
    console.error('Failed to fetch Substack feed', err);
    return NextResponse.json({ error: 'Failed to fetch Substack feed' }, { status: 500 });
  }
}
