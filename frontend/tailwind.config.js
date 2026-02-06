/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Check if your files are actually in /src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}