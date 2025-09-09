# George Wing - Personal Website

A game menu-inspired personal website with a retro-futuristic UI aesthetic, built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

- **Game Menu UI**: PS2/Xbox-era inspired interface with smooth animations
- **Last.fm Integration**: Real-time music statistics with interactive genre visualization
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Responsive Design**: Optimized for desktop and mobile viewing
- **Keyboard Navigation**: Full accessibility with arrow key navigation

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom game-themed design system
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React
- **Music Data**: Last.fm API integration
- **Deployment**: Vercel

## 📊 Current Projects

- **Personal Website** (Shipped) - The site you're viewing
- **Tetris AI Emulator** (WIP) - AI using heuristics to play Tetris optimally  
- **Goals App** (WIP) - Goal Tree management with autonomous AI agents

## 🎵 Music Integration

Real-time Last.fm data featuring:
- Genre distribution with interactive donut charts
- Top artists with clickable profiles
- Recent loved tracks
- Configurable time periods (week to all-time)

## 🎯 Design Philosophy

- **Retro-futuristic aesthetic** without CRT/vaporwave clichés
- **Game-first interactions** with hover states and sound-inspired feedback
- **Performance-optimized** with client-side caching and smooth loading states
- **Clean typography** using Orbitron and JetBrains Mono fonts

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Environment Setup

Required environment variables:

```bash
LASTFM_API_KEY=your_lastfm_api_key
LASTFM_SHARED_SECRET=your_lastfm_secret
LASTFM_USERNAME=GeorgeWing
# Substack base URL (no trailing slash), e.g. https://yourname.substack.com
SUBSTACK_URL=
NEXT_PUBLIC_SUBSTACK_URL=
```

## 🚀 Deployment

Optimized for Vercel deployment with:
- Automatic builds on push to main
- Environment variable configuration
- Edge runtime optimization for API routes

---

Built with ❤️ using modern web technologies and game-inspired design principles.
