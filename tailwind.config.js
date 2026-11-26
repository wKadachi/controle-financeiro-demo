/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#0B0B0E',       // Pitch Black Background
          card: '#14121B',     // Dark Card Background
          border: '#241A30',   // Dark Plum Border / Surface
          purple: '#51307A',   // Royal Purple Primary Accent
          light: '#EFEAFF',    // Pale Lavender Text / Highlights
        }
      }
    },
  },
  plugins: [],
}
