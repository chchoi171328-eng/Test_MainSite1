import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './contexts/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#C5A47E',
          dark: '#222222',
          gray: '#4A4A4A',
          light: '#F9F9F9',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Noto Sans KR"', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
      },
    },
  },
  plugins: [typography],
};
