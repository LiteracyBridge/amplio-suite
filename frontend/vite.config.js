import { fileURLToPath, URL } from "node:url";
import svgLoader from "vite-svg-loader";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), svgLoader()],
    server: {
        host: true,
        port: 8080
    },
    define: {
        global: {}
        // _global: ({}),
    },
    resolve: {
        alias: {
            "./runtimeConfig": "./runtimeConfig.browser",
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
    css: {
        preprocessorOptions: {
            less: {
                math: "always",
                relativeUrls: true,
                javascriptEnabled: true
            }
        }
    }
});
