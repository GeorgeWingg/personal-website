import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'terminal-black': '#050505', // Deep black
        'terminal-dark': '#0a0a0a',  // Almost black
        'terminal-grid': '#1a1a1a',  // Dark gray for grids
        'terminal-border': '#333333', // Standard border
        'terminal-text': '#a1a1aa',   // Zinc 400
        'terminal-header': '#f4f4f5', // Zinc 100
        'terminal-accent': '#00f0ff', // Cyber Cyan
        'cyber-blue': '#00f0ff',
        'cyber-purple': '#bd00ff',
        'cyber-pink': '#ff0055',
        // Keep legacy names mapped to new values temporarily to prevent crashes before full refactor
        'game-black': '#050505',
        'game-dark': '#0a0a0a',
        'game-panel': 'rgba(10, 10, 10, 0.8)', // Glassy panel
        'game-border': '#333333',
        'game-text': '#a1a1aa',
        'game-green': '#00f0ff', // Neon green becomes Cyber Cyan
        'game-blue': '#bd00ff',  // Blue becomes Cyber Purple
        'game-red': '#ff0055',   // Red becomes Cyber Pink
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'terminal-card': '0 0 0 1px #333333',
        'terminal-focus': '0 0 0 2px #00f0ff',
        'neon-blue': '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)',
        'neon-purple': '0 0 10px rgba(189, 0, 255, 0.5), 0 0 20px rgba(189, 0, 255, 0.3)',
      },
      backgroundImage: {
        'terminal-grid-pattern': 'linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'slide-in': 'slide-in 200ms cubic-bezier(0.16, 1, 0.3, 1)', // Snappier
        'fade-in': 'fade-in 150ms ease-in',
      },
      keyframes: {
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config