/**
 * @type {import('vite').UserConfig}
 */

import { fileURLToPath, URL } from "node:url";
import svgLoader from "vite-svg-loader";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ["tableau-viz"].includes(tag),
        },
      },
    }),
    svgLoader(),
  ],
  optimizeDeps: {
    include: ["axe-core"],
  },
  server: {
    host: true,
    port: 8080,
  },
  define: {},
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        math: "always",
        relativeUrls: true,
        javascriptEnabled: true,
      },
    },
  },
  build: {
    sourcemap: mode === "development" || mode === "staging",
  },
}));
