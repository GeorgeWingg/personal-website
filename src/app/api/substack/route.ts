import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

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

    const fromEnv = (process.env.SUBSTACK_URL || process.env.NEXT_PUBLIC_SUBSTACK_URL || '').replace(/\/$/, '');
    // The ?baseUrl= override is a dev-only convenience; in production it would
    // let anyone use this route to make the server fetch arbitrary URLs (SSRF)
    const fromQuery =
      process.env.NODE_ENV !== 'production'
        ? (url.searchParams.get('baseUrl') || '').replace(/\/$/, '')
        : '';
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

    // Fetch through Next's data cache (30 min) instead of parser.parseURL,
    // which uses its own HTTP client and re-downloads the feed every request
    const feedResponse = await fetch(feedUrl, { next: { revalidate: 1800 } });
    if (!feedResponse.ok) {
      throw new Error(`Feed request failed: ${feedResponse.status}`);
    }
    const feed = await parser.parseString(await feedResponse.text());

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
