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
        progress: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        }
      },
      animation: {
        'progress': 'progress 3s ease-in-out forwards',
        pulseHeart: "pulseHeart 0.6s ease-in-out",
      },
    },
  },
  plugins: [],
};
