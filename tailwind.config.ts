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
        'game-black': '#0A0A0A',
        'game-dark': '#111111',
        'game-panel': '#1A1A1A',
        'game-border': '#333333',
        'game-text': '#B0B0B0',
        'game-green': '#8CFF8C',
        'game-blue': '#00B4D8',
        'game-red': '#FF1744',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'game-panel': '0 4px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
        'game-glow': '0 0 30px rgba(140,255,140,0.4), inset 0 0 20px rgba(140,255,140,0.2)',
        'game-depth': '0 0 20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        'game-gloss': 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
        'game-panel-gradient': 'linear-gradient(135deg, #1a1a1a 0%, #111111 100%)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 1s ease-in-out infinite',
        'slide-in': 'slide-in 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fade-in 150ms ease-in',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
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