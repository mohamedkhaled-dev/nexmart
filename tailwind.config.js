/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      animation: {
        slide: "slide 40s linear infinite", 
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateX(100%)" }, 
          "100%": { transform: "translateX(-100%)" }, 
        },
      },
      colors: {
        primary: "#F1F1F1",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
