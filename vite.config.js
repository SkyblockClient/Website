import { defineConfig } from "vite";
import { resolve } from "path";
import { minify } from "html-minifier-terser";

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
        404: resolve(__dirname, "docs", "404.html"),
      },
    },
  },
  plugins: [
    {
      name: "minify-html",
      transformIndexHtml: {
        handler(html, ctx) {
          return minify(html, {
            collapseWhitespace: true,
          });
        },
      },
    },
  ],
});
