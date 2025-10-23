/// <reference types="vitest" />

import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { defineConfig } from "vite";

// Advanced chunking strategy for better performance
const manualChunks = (id: string) => {
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

    // Large libraries that should be separate
    if (
      id.includes("lodash") ||
      id.includes("moment") ||
      id.includes("date-fns")
    ) {
      return "utils-vendor";
    }

    // Audio/media libraries
    if (id.includes("audio") || id.includes("media") || id.includes("sound")) {
      return "audio-vendor";
    }

    // All other node_modules go to vendor
    return "vendor";
  }

  // App chunking
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

    // Utils and helpers
    if (id.includes("/utils/") || id.includes("/helpers/")) {
      return "utils";
    }
  }
};

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
        manualChunks,
        // Optimize chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId;
          if (facadeModuleId) {
            return "[name].[hash].js";
          }
          return "[name].[hash].js";
        },
        // Optimize asset naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name!.split(".");
          const extension = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extension)) {
            return `images/[name].[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(extension)) {
            return `fonts/[name].[hash][extname]`;
          }
          if (/css/i.test(extension)) {
            return `styles/[name].[hash][extname]`;
          }
          return `assets/[name].[hash][extname]`;
        },
      },
    },
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          "console.log",
          "console.info",
          "console.debug",
          "console.warn",
        ],
      },
      mangle: {
        safari10: true,
      },
    },
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging (optional)
    sourcemap: false,
    // Optimize for mobile
    cssCodeSplit: true,
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
