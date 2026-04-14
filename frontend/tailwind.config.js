/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#1e293b',
        accent: '#8B5CF6',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
