/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        caramel: '#C08552',
        'coffee-brown': '#8C5A3C',
        'dark-espresso': '#4B2E2B',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(75, 46, 43, 0.08)',
        card: '0 4px 20px rgba(140, 90, 60, 0.06)',
        hover: '0 14px 40px rgba(75, 46, 43, 0.12)',
      },
    },
  },
  plugins: [],
};
