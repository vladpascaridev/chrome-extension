import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import { resolve } from "path";
import manifest from "./public/manifest.json";

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  resolve: {
    alias: {
      src: resolve(__dirname, "src"),
      components: resolve(__dirname, "src/components"),
      context: resolve(__dirname, "src/context"),
      types: resolve(__dirname, "src/types"),
      utils: resolve(__dirname, "src/utils"),
      lib: resolve(__dirname, "src/lib"),
      hooks: resolve(__dirname, "src/hooks"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"),
      },
    },
  },
});
