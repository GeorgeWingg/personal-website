# Claude Code Project Memory

## Project Overview
George's personal website with a PS2/Xbox-era game menu interface. Built with Next.js, TypeScript, and Tailwind CSS (v4).

## Key Design Decisions

### Visual Style
- Retro-futuristic game UI aesthetic (NOT vaporwave or CRT effects)
- Current look: dark slate panels with white outlines, monospace type — George likes this and it is the intended design
- **Important**: `tailwind.config.ts` is NOT loaded (Tailwind v4 ignores v3 JS configs without an `@config` directive), so all `game-*` utility classes, `font-orbitron`, `shadow-game-*`, and `animate-spin-slow` are inert. The visible design comes from standard utilities + globals.css. Do not "fix" this without asking — the unthemed look is preferred. If the neon theme is ever wanted back, migrate the tokens to an `@theme` block in globals.css.
- Orbitron + JetBrains Mono are loaded via next/font; body text uses JetBrains Mono (globals.css). Orbitron is currently unused because the `font-orbitron` utility doesn't exist.

### Navigation
- Fixed sidebar menu (25% width)
- Active state with white outline only (green highlight removed per user request)
- Keyboard navigation support (arrow keys; w/s also navigate)
- URL hash-based routing

## Current Features

### 1. Game Menu Navigation
- About, Projects, Now, Music, Blog, Contact sections
- Active state tracking with URL updates

### 2. Music Panel (Last.fm Integration)
- **Unified Time Selector**: Controls all stats (Week to All Time)
- **Top Albums**: Artwork grid with auto/3x3/5x5 sizing
- **Now Playing**: Compact bar with album art (polls every 60s, paused while tab hidden)
- **Top Artists**: Bar chart with play counts (top 10)
- **Recent Loves**: Grid of loved tracks
- (Genre donut chart was removed in June 2026 — it was unused dead code; see git history if it's ever wanted back)

### 3. Blog Panel
- Substack RSS preview via `/api/substack` (feed cached 30 min via fetch revalidate)
- `?baseUrl=` override works in dev only (SSRF guard in production)

### 4. Link Dock
- GitHub, X (Twitter), LinkedIn, Email
- Fixed at bottom of screen
- Icon-based with hover effects

## Technical Implementation

### API Routes
All Last.fm data fetched through server-side routes (upstream calls cached 5 min via fetch revalidate):
- `/api/lastfm/recent-tracks` - Now playing data (`?limit=`, extended=1 → artist is `{name,url,image}`, NOT `#text`)
- `/api/lastfm/top-artists` - Artist rankings
- `/api/lastfm/loved-tracks` - Loved tracks
- `/api/lastfm/albums-with-artwork` - Top albums + artwork URLs
- `/api/substack` - Substack RSS preview

### Performance Optimizations
1. **localStorage caching** - 1-hour cache for album artwork data (stale-while-revalidate)
2. **Hidden-tab pause** - Now-playing poll skips while document.hidden
3. **Skeleton loaders** - Better perceived performance
4. **Right-sized fetches** - recent-tracks limit 5, top-artists limit 10 (chart shows 10)

### Known Issues Fixed
- Menu double outline bug (removed green highlight)
- Now Playing artist name was blank (extended-mode response has `artist.name`, code read `artist['#text']`)
- Icon metadata pointed at `/icon-192.png`/`/icon-512.png` which 404'd (file conventions serve app/icon.png + app/apple-icon.png automatically)

## User Preferences
- Keep visual elements consistent (no special treatment for top items)
- Minimal text, concise responses
- Focus on functionality over flashy effects
- Email: georgewingwig@gmail.com (not example.com)
- Likes the current unthemed slate look (see Visual Style)

## Environment Setup
```bash
LASTFM_API_KEY=your_key
LASTFM_SHARED_SECRET=your_secret
LASTFM_USERNAME=GeorgeWing
# Substack base URL (no trailing slash)
SUBSTACK_URL=https://yourname.substack.com
```

## Recent Changes (June 2026 audit cleanup)
- Fixed Now Playing artist name (extended-mode shape) + LastfmArtist type
- SSRF guard + real caching on `/api/substack`; removed client `no-store`
- Removed broken icon metadata entries; rely on Next file conventions
- Added OpenGraph/Twitter metadata
- Purged ~1,800 lines of dead code: GenreDonutChart, GenreChartSkeleton, legacy *Section components, 5 unused hooks, 6 unused API routes (genre-analysis, user-info, user-tags, weekly-charts, weekly-artist-chart, top-albums), unused lastfm client methods/types, boilerplate public assets
- NowPanel "Last updated" is now a hardcoded honest date (bump `LAST_UPDATED` when editing content)
- Interest pills are decorative spans, not fake buttons
- `MotionConfig reducedMotion="user"` respects prefers-reduced-motion
- Escape closes the mobile menu
