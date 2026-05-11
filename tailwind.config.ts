import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-heebo)', 'system-ui', 'sans-serif'],
      },
      colors: {
        sand: {
          50: '#f5efe6',
          100: '#ede4d4',
          200: '#e3d6bf',
          cream: '#fbf6ee',
        },
        ink: {
          DEFAULT: '#2b241c',
          soft: '#5a4f42',
          mute: '#8b7e6e',
        },
        clay: {
          DEFAULT: '#c4663d',
          soft: '#e8a883',
          bg: '#f6e3d4',
        },
        sage: {
          DEFAULT: '#6f8a6c',
          bg: '#dde7d9',
        },
        amber_: {
          DEFAULT: '#c69230',
          bg: '#f3e3b8',
          ink: '#6b4a0d',
        },
        crimson: {
          DEFAULT: '#b03a2e',
          deep: '#7e1f17',
          bg: '#fce4df',
        },
        muted_blue: {
          DEFAULT: '#4a6fa5',
          soft: '#aec3e0',
          bg: '#e6eef8',
        },
      },
      borderRadius: {
        card: '22px',
        tile: '18px',
      },
      boxShadow: {
        card: '0 1px 0 rgba(43,36,28,0.04), 0 6px 20px -10px rgba(43,36,28,0.10)',
        soft: '0 1px 0 rgba(43,36,28,0.04)',
      },
      animation: {
        'slide-up': 'slideUp 0.26s cubic-bezier(.2,.7,.3,1)',
        pop: 'pop 0.3s cubic-bezier(.2,.9,.3,1.2)',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
