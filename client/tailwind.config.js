/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // 👈 enable class-based dark mode
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        dark: "#0f172a",
      },
      keyframes: {
        pulseHeart: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
      },
      animation: {
        pulseHeart: "pulseHeart 0.6s ease-in-out",
      },
    },
  },
  plugins: [],
};
