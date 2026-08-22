/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', ':is(.dark, .ai)'],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        'lg-custom': '1260px',
        'md-custom': '1168px',
        'xs': '390px',
        'sidebar': '960px',
        '2md': '920px',
        '2xl': '1440px',
      },
      colors: {
        // Brand accent colors
        brand: {
          orange: '#ea580c',
          'orange-light': '#f97316',
          'orange-dim': 'rgba(234,88,12,0.15)',
          green: '#22c55e',
          'green-dim': 'rgba(34,197,94,0.15)',
        },
        // Dark mode surfaces
        dark: {
          bg: '#0a0a0f',
          surface: '#111118',
          card: '#1a1a2e',
          card2: '#16213e',
          border: 'rgba(255,255,255,0.1)',
          muted: 'rgba(255,255,255,0.4)',
          secondary: 'rgba(255,255,255,0.7)',
          primary: 'rgba(255,255,255,0.92)',
        },
        // Light mode surfaces
        light: {
          bg: '#f4f4f8',
          surface: '#ffffff',
          card: '#ffffff',
          card2: '#f0f0f6',
          border: 'rgba(0,0,0,0.1)',
          muted: 'rgba(0,0,0,0.4)',
          secondary: 'rgba(0,0,0,0.65)',
          primary: 'rgba(0,0,0,0.9)',
        },
      },
      fontFamily: {
        raleway: ['raleway', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-orange': 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
        'gradient-card-dark': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        'gradient-card-light': 'linear-gradient(135deg, #ffffff 0%, #f0f0f6 100%)',
      },
    },
  },
  plugins: [],
};
