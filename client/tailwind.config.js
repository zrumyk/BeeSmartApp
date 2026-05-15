/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        beesmart: {
          yellow: '#FFD60A',
          black: '#0A0A0A',
          white: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
}

