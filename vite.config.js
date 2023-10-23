import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  appType: "mpa",
  root: "docs",
  publicDir: "../public",
  build: {
    outDir: "../build",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "docs", "index.html"),
        backport: resolve(__dirname, "docs", "backport", "index.html"),
      },
    },
  },
});
