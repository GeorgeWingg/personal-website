# Claude Code Project Memory

## Project Overview
George's personal website with a PS2/Xbox-era game menu interface. Built with Next.js, TypeScript, and Tailwind CSS.

## Key Design Decisions

### Visual Style
- Retro-futuristic game UI aesthetic (NOT vaporwave or CRT effects)
- Dark theme with neon accents (green, blue, red)
- Panel-based layout with depth effects
- Orbitron and JetBrains Mono fonts

### Navigation
- Fixed sidebar menu (25% width)
- Active state with white outline only (green highlight removed per user request)
- Keyboard navigation support (arrow keys)
- URL hash-based routing

## Current Features

### 1. Game Menu Navigation
- About, Projects, Now, Music, Contact sections
- Smooth transitions between panels
- Active state tracking with URL updates

### 2. Music Panel (Last.fm Integration)
- **Unified Time Selector**: Controls all stats (Week to All Time)
- **Now Playing**: Compact bar with album art
- **Genre Distribution**: Donut chart visualization
  - Shows top genre in center
  - Tooltips appear next to hovered segments
  - Horizontal legend at bottom
- **Top Artists**: Bar chart with play counts
- **Recent Loves**: Grid of loved tracks
- **Performance**: Client-side caching, batch API requests

### 3. Link Dock
- GitHub, X (Twitter), LinkedIn, Email
- Fixed at bottom of screen
- Icon-based with hover effects

## Technical Implementation

### API Routes
All Last.fm data fetched through server-side routes:
- `/api/lastfm/genre-analysis` - Aggregates artist tags into genres
- `/api/lastfm/recent-tracks` - Now playing data
- `/api/lastfm/top-artists` - Artist rankings
- `/api/lastfm/loved-tracks` - Loved tracks

### Performance Optimizations
1. **localStorage caching** - 1-hour cache for genre data
2. **Batch processing** - API calls in groups of 5
3. **Background updates** - Refresh old data without blocking UI
4. **Skeleton loaders** - Better perceived performance

### Known Issues Fixed
- Menu double outline bug (removed green highlight)
- Genre chart tooltip positioning
- Long genre name handling in donut center

## User Preferences
- Keep visual elements consistent (no special treatment for top items)
- Minimal text, concise responses
- Focus on functionality over flashy effects
- Email: georgewingwig@gmail.com (not example.com)

## Environment Setup
```bash
LASTFM_API_KEY=your_key
LASTFM_SHARED_SECRET=your_secret
LASTFM_USERNAME=GeorgeWing
```

## Recent Changes
- Switched from bar chart to donut chart for genres
- Fixed tooltip to appear outside donut
- Added top genre display in center
- Implemented comprehensive caching system
- Updated all documentation files