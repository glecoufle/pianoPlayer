/// <reference types="vitest" />

import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), legacy()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Node modules chunking
          if (id.includes("node_modules")) {
            // Vue ecosystem
            if (id.includes("vue") || id.includes("@vue")) {
              return "vue-vendor";
            }

            // Ionic ecosystem
            if (id.includes("@ionic") || id.includes("ionicons")) {
              return "ionic-vendor";
            }

            // Capacitor ecosystem
            if (id.includes("@capacitor")) {
              return "capacitor-vendor";
            }

            // All other node_modules go to vendor
            return "vendor";
          }

          // App chunking based on file paths
          if (id.includes("/src/")) {
            // Services
            if (id.includes("/services/")) {
              return "services";
            }

            // Components
            if (id.includes("/components/")) {
              return "components";
            }

            // Views/Pages
            if (id.includes("/views/")) {
              return "views";
            }

            // Data and types
            if (id.includes("/data/") || id.includes("/types/")) {
              return "data-types";
            }
          }
        },
      },
    },
    // Additional build optimizations
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Increase chunk size warning limit for mobile apps
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: true,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
});
