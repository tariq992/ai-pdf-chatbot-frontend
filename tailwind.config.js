/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        // Wave animations for typing dots
        wave1: {
          "0%, 60%, 100%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(-6px)" },
        },
        wave2: {
          "0%, 60%, 100%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(6px)" },
        },
        wave3: {
          "0%, 60%, 100%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(-6px)" },
        },
        // Fade in animation
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        // Optional: wave + opacity for smoother feel
        waveFade1: {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.5" },
          "30%": { transform: "translateY(-6px)", opacity: "1" },
        },
        waveFade2: {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.5" },
          "30%": { transform: "translateY(6px)", opacity: "1" },
        },
        waveFade3: {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.5" },
          "30%": { transform: "translateY(-6px)", opacity: "1" },
        },
      },
      animation: {
        wave1: "wave1 1.2s infinite ease-in-out",
        wave2: "wave2 1.2s infinite ease-in-out",
        wave3: "wave3 1.2s infinite ease-in-out",
        fadeIn: "fadeIn 0.3s ease-in",
        waveFade1: "waveFade1 1.2s infinite ease-in-out",
        waveFade2: "waveFade2 1.2s infinite ease-in-out",
        waveFade3: "waveFade3 1.2s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
