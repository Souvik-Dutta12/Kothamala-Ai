/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      keyframes: {
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-40%, -40%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(0%, 0%) scale(1)",
          },
        },
      },
      animation: {
        spotlight: "spotlight 1.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
