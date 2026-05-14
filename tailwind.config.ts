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
        bg: '#08090c',
        surface: '#0d0f14',
        border: '#1a2030',
        primary: '#00ff9d',
        secondary: '#4a9eff',
        danger: '#ff3c00',
        'text-dim': '#8b98b0',
        'text-bright': '#c4ccd4',
      },
      fontFamily: {
        mono: ['Space Mono', 'Courier New', 'monospace'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'scan': 'scan 8s linear infinite',
        'glitch': 'glitch 2s infinite',
        'fadeInUp': 'fadeInUp 0.6s ease forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '10%': { transform: 'translate(-2px, -1px)' },
          '20%': { transform: 'translate(2px, 1px)' },
          '30%': { transform: 'translate(-1px, 2px)' },
          '40%': { transform: 'translate(1px, -1px)' },
          '50%': { transform: 'translate(-2px, 1px)' },
          '60%': { transform: 'translate(2px, -1px)' },
          '70%': { transform: 'translate(-1px, -2px)' },
          '80%': { transform: 'translate(1px, 2px)' },
          '90%': { transform: 'translate(2px, -2px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 255, 157, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 255, 157, 0.6), 0 0 40px rgba(0, 255, 157, 0.2)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
