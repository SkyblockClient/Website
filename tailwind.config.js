export default {
  content: ["docs/**/*.html"],
  theme: {
    extend: {
      colors: {
        "main-4": "#8ff03f",
        "main-3": "#70cb44",
        "main-2": "#56a644",
        "main-1": "#42823f",
        "main-0": "#336037",
        primary: "rgb(145 239 99)",
        "on-primary": "rgb(17 56 0)",
        "primary-container": "rgb(45 79 28)",
        "on-primary-container": "rgb(197 239 171)",
        background: "rgb(17 20 15)",
        "on-background": "rgb(225 228 217)",
        "surface-container-low": "rgb(25 29 22)",
        "surface-container-high": "rgb(40 43 36)",
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "system-ui", "sans-serif"],
      },
    },
    borderRadius: {
      none: "0",
      1: "0.25rem",
      2: "0.5rem",
      4: "1rem",
      6: "1.5rem",
      8: "2rem",
      full: "99rem",
    },
  },
  plugins: [],
};
