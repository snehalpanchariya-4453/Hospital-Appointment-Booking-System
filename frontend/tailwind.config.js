/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5f7',
          100: '#fce4ec', // Soft Baby Pink
          200: '#f8bbd0', // Pastel Baby Pink
          300: '#f48fb1', // Blush Pink
          400: '#f06292', // Rose Pink Accent
          500: '#ec407a', // Vibrant Blossom Pink
          600: '#d81b60', // Deep Rose
          700: '#c2185b',
          800: '#ad1457',
          900: '#880e4f',
        },
      },
      boxShadow: {
        'soft-pink': '0 10px 25px -5px rgba(244, 143, 177, 0.2), 0 8px 10px -6px rgba(244, 143, 177, 0.1)',
        'glow-pink': '0 0 20px rgba(236, 64, 122, 0.25)',
      },
    },
  },
  plugins: [],
}
