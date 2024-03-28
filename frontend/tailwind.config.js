/** @type {import('tailwindcss').Config} */

const animated = require('tailwindcss-animated');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aqua: '#36E08D'
      }
    },
  },
  plugins: [
    animated
  ],
}
