/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      colors: {
        // Modern 2026 color palette
        'dev-blue': {
          50: '#e6f1ff',
          100: '#cce3ff',
          200: '#99c7ff',
          300: '#66abff',
          400: '#338fff',
          500: '#0073ff',
          600: '#005ccc',
          700: '#004599',
          800: '#002e66',
          900: '#001733',
        },
        'dev-purple': {
          50: '#f3e5ff',
          100: '#e7ccff',
          200: '#cf99ff',
          300: '#b766ff',
          400: '#9f33ff',
          500: '#8700ff',
          600: '#6c00cc',
          700: '#510099',
          800: '#360066',
          900: '#1b0033',
        },
        'dev-teal': {
          50: '#e6fffa',
          100: '#ccfff5',
          200: '#99ffeb',
          300: '#66ffe1',
          400: '#33ffd7',
          500: '#00ffcd',
          600: '#00cca4',
          700: '#00997b',
          800: '#006652',
          900: '#003329',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-light':
          'radial-gradient(at 0% 0%, #fef3c7 0px, transparent 50%), radial-gradient(at 100% 0%, #ddd6fe 0px, transparent 50%), radial-gradient(at 100% 100%, #bfdbfe 0px, transparent 50%), radial-gradient(at 0% 100%, #fecaca 0px, transparent 50%)',
        'mesh-dark':
          'radial-gradient(at 0% 0%, #1e1b4b 0px, transparent 50%), radial-gradient(at 100% 0%, #581c87 0px, transparent 50%), radial-gradient(at 100% 100%, #164e63 0px, transparent 50%), radial-gradient(at 0% 100%, #1e3a8a 0px, transparent 50%)',
      },
      animation: {
        'gradient-slow': 'gradient 8s ease infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
