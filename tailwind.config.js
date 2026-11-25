/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        steel: {
          50: "#f4f5f6",
          100: "#e6e8eb",
          200: "#cdd1d7",
          300: "#a8afb9",
          400: "#7e8693",
          500: "#5f6772",
          600: "#4b525b",
          700: "#3d424a",
          800: "#33373d",
          900: "#1a1d21",
          950: "#0f1113",
        },
        molten: {
          50: "#fff8ed",
          100: "#ffefd4",
          200: "#fddba8",
          300: "#fbc071",
          400: "#f9993a",
          500: "#f5781a",
          600: "#e85d0c",
          700: "#c2440b",
          800: "#9a3712",
          900: "#7c2f12",
        },
      },
      fontFamily: {
        heading: ["Oswald", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
