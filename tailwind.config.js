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
        primary: "rgb(152 213 164)",
        "on-primary": "rgb(0 57 26)",
        "primary-container": "rgb(22 81 44)",
        "on-primary-container": "rgb(179 241 191)",
        background: "rgb(16 21 16)",
        "on-background": "rgb(223 228 220)",
        "surface-container-low": "rgb(24 29 24)",
        "surface-container-high": "rgb(38 43 38)",
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
