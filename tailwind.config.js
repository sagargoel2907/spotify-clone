/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "green": "#1db954",
        "black": "#191414",
        "primary": "#ffffff",
        "light-black": "#282828",
        "secondary": "#b3b3b3",
        "gray": "#535353"
      },
      gridTemplateColumns: {
        "auto-fill-card": "repeat(auto-fill,minmax(200px,1fr))"
      }
    },
  },
  plugins: [],
}

