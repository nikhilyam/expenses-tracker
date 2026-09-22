/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { ink: '#17211b', sage: '#6c8b72', cream: '#f6f3ea', coral: '#d9785d' },
      fontFamily: { display: ['Georgia', 'serif'], sans: ['Inter', 'ui-sans-serif', 'sans-serif'] },
    },
  },
  plugins: [],
};
