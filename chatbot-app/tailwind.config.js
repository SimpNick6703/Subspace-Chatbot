/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors (based on monokai-dimmed)
        dark: {
          bg: '#1e1e1e',
          surface: '#272727',
          border: '#505050',
          text: '#c5c8c6',
          accent: '#3655b5',
          success: '#86B42B',
          warning: '#B3B42B',
          error: '#C4265E',
        },
        // Light theme colors (based on solarized)
        light: {
          bg: '#FDF6E3',
          surface: '#EEE8D5',
          border: '#DDD6C1',
          text: '#657B83',
          accent: '#B58900',
          success: '#859900',
          warning: '#B58900',
          error: '#dc322f',
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
