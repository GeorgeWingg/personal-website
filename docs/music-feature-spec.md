# Music Feature Specification

## Overview
The Music panel integrates with Last.fm API to display real-time listening data and music taste analysis.

## Current Implementation

### 1. **Time Period Selector**
- Unified control for all music stats
- Options: Week, Month, 3 Months, 6 Months, Year, All Time
- Located at top of panel, controls all visualizations below

### 2. **Now Playing Display**
- Compact bar showing currently playing track (if any)
- Shows album art, track name, artist, and album
- Animated spinning disc icon
- Auto-refreshes every minute

### 3. **Genre Distribution (Donut Chart)**
- Visual breakdown of top genres based on listening history
- Interactive donut chart with:
  - Animated segments on load
  - Hover tooltips positioned next to segments
  - Center shows top genre name and percentage
  - Horizontal legend at bottom
  - Handles long genre names with truncation
- Aggregates genre data from top artists' tags
- Filters out non-genre tags (locations, descriptors, etc.)

### 4. **Top Artists (Bar Chart)**
- Horizontal bar chart showing play counts
- Animated bars with game UI colors
- Shows rank, name, and play count
- Responsive to time period changes

### 5. **Recent Loves**
- Grid display of recently loved tracks
- Shows track name and artist
- Hover effects with color transitions

## Technical Details

### API Integration
- Server-side API routes for secure credential handling
- Client-side hooks for data fetching
- Endpoints:
  - `/api/lastfm/recent-tracks` - Now playing and recent tracks
  - `/api/lastfm/top-artists` - Top artists by period
  - `/api/lastfm/genre-analysis` - Aggregated genre data
  - `/api/lastfm/loved-tracks` - Recently loved tracks
  - `/api/lastfm/user-info` - User statistics
  - `/api/lastfm/weekly-charts` - Weekly chart data

### Performance Optimizations
1. **Client-side Caching**
   - localStorage caching with 1-hour expiry
   - Background refresh for data older than 30 minutes
   - Instant load for cached periods

2. **Batch Processing**
   - Genre analysis fetches artist tags in batches of 5
   - 200ms delay between batches for rate limiting
   - Parallel processing within batches

3. **Loading States**
   - Animated skeleton loaders
   - Maintains previous data while fetching new

### Visual Design
- Consistent with game UI theme
- Dark backgrounds with neon accents
- Smooth Framer Motion animations
- Responsive layout for mobile/desktop

## Environment Variables
```
LASTFM_API_KEY=your_api_key
LASTFM_USERNAME=your_username
```

## Future Enhancements
- Listening trends over time (line charts)
- Music discovery score
- Genre similarity network visualization
- Spotify integration for additional data