/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3377FF',
        secondary: '#10B981',
        accent: '#9D24FF',
        dark: '#111827',
        risk: '#EF4444',
        warning: '#F59E0B'
      }
    },
  },
  plugins: [],
}
