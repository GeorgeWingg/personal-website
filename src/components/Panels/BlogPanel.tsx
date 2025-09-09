'use client';

import { useEffect, useState } from 'react';
import { Newspaper, ExternalLink, Rss } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContentNavigation } from '@/hooks/useContentNavigation';

interface BlogPanelProps {
  isActive?: boolean;
}

interface PostItem {
  title: string;
  link: string;
  publishedAt: string | null;
  excerpt: string;
}

interface FeedResponse {
  publication: { title: string; homeUrl: string };
  items: PostItem[];
  error?: string;
}

function formatDate(iso: string | null) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export default function BlogPanel({ isActive = false }: BlogPanelProps) {
  const { containerRef } = useContentNavigation({ isActive });
  const [data, setData] = useState<FeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/substack?limit=5', { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load feed');
        if (mounted) {
          setData(json);
        }
      } catch (e: unknown) {
        const err = e as { message?: string };
        if (mounted) setError(err?.message || 'Failed to load feed');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const homeUrl = data?.publication.homeUrl || process.env.NEXT_PUBLIC_SUBSTACK_URL || '#';

  return (
    <div ref={containerRef} className="max-w-3xl">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-orbitron font-bold text-3xl mb-8 text-game-green"
      >
        BLOG
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {/* Callout / Subscribe */}
        <div className="p-6 bg-game-dark rounded-lg border border-game-border">
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="w-6 h-6 text-game-green" />
            <h3 className="font-orbitron font-bold text-xl text-white">Read On Substack</h3>
          </div>
          <p className="text-game-text mb-4">
            Essays, notes, and experiments. Subscribe if you want new posts in your inbox.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={homeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-game-panel-gradient border border-game-border hover:border-game-green/50 hover:shadow-game-glow transition-all"
            >
              Visit Substack
              <ExternalLink size={16} />
            </a>
            <a
              href={`${homeUrl}/feed`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-game-dark border border-game-border text-game-text hover:text-game-green hover:border-game-green/50 transition-all"
            >
              <Rss size={16} /> RSS
            </a>
          </div>
        </div>

        {/* Recent posts */}
        <div className="p-6 bg-game-dark rounded-lg border border-game-border">
          <h3 className="font-orbitron font-bold text-sm text-game-green mb-4">RECENT POSTS</h3>
          {loading && (
            <div className="grid gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse h-16 rounded bg-white/5 border border-white/10" />
              ))}
            </div>
          )}
          {!loading && error && (
            <p className="text-game-text">{error}</p>
          )}
          {!loading && !error && data && (
            <div className="grid gap-3">
              {data.items.map((post) => (
                <a
                  key={post.link}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-4 rounded-lg bg-game-panel-gradient border border-game-border hover:border-game-green/50 hover:shadow-game-glow transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-white group-hover:text-game-green transition-colors font-semibold mb-1">
                        {post.title}
                      </h4>
                      <p className="text-sm text-game-text line-clamp-2">{post.excerpt}</p>
                    </div>
                    <span className="text-xs text-game-text whitespace-nowrap">{formatDate(post.publishedAt)}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
