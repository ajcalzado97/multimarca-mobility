/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        vodafone: {
          red: '#E60000',
          'red-dark': '#CC0000',
          'red-light': '#FF1A1A',
          gray: {
            50: '#F8F8F8',
            100: '#F0F0F0',
            200: '#E0E0E0',
            300: '#CCCCCC',
            400: '#999999',
            500: '#666666',
            600: '#4D4D4D',
            700: '#333333',
            800: '#1A1A1A',
            900: '#0D0D0D',
          }
        }
      }
    },
  },
  plugins: [],
};
