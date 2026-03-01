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
        className="font-orbitron font-bold text-3xl mb-8 text-cyber-blue drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]"
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
        <div className="p-6 bg-black/30 backdrop-blur-sm rounded-sm border border-terminal-border/50 shadow-inner">
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="w-6 h-6 text-cyber-blue" />
            <h3 className="font-orbitron font-bold text-xl text-white">
              Read On Substack
            </h3>
          </div>
          <p className="text-terminal-text mb-4">
            Essays, notes, and experiments. Subscribe if you want new posts in your inbox.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={homeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-black/50 border border-terminal-border hover:border-cyber-blue hover:text-cyber-blue hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all group"
            >
              Visit Substack
              <ExternalLink size={16} className="group-hover:rotate-45 transition-transform" />
            </a>
            <a
              href={`${homeUrl}/feed`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-transparent border border-terminal-border text-terminal-text hover:text-white hover:border-white/50 transition-all"
            >
              <Rss size={16} /> RSS
            </a>
          </div>
        </div>

        {/* Recent posts */}
        <div className="p-6 bg-black/30 backdrop-blur-sm rounded-sm border border-terminal-border/50 shadow-inner">
          <h3 className="font-orbitron font-bold text-sm text-cyber-blue mb-4 drop-shadow-[0_0_5px_rgba(0,240,255,0.6)]">
            RECENT POSTS
          </h3>
          {loading && (
            <div className="grid gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse h-16 rounded-sm bg-white/5 border border-white/10" />
              ))}
            </div>
          )}
          {!loading && error && (
            <p className="text-terminal-text">{error}</p>
          )}
          {!loading && !error && data && (
            <div className="grid gap-3">
              {data.items.map((post) => (
                <a
                  key={post.link}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-4 rounded-sm bg-black/40 border border-terminal-border/50 hover:border-cyber-blue/60 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-cyber-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="flex items-start justify-between gap-4 relative z-10">
                    <div>
                      <h4 className="text-white group-hover:text-cyber-blue transition-colors font-semibold mb-1">
                        {post.title}
                      </h4>
                      <p className="text-sm text-terminal-text line-clamp-2">{post.excerpt}</p>
                    </div>
                    <span className="text-xs text-terminal-text whitespace-nowrap">{formatDate(post.publishedAt)}</span>
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
