import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Don't inline small assets as base64 — serve them as separate cacheable files
    assetsInlineLimit: 0,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate React core into its own long-cached chunk
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react";
          }
          // Separate router
          if (id.includes("node_modules/react-router")) {
            return "vendor-router";
          }
          // Separate UI component library
          if (id.includes("node_modules/@radix-ui") || id.includes("node_modules/lucide-react")) {
            return "vendor-ui";
          }
          // Separate data-fetching libraries
          if (id.includes("node_modules/@tanstack") || id.includes("node_modules/axios")) {
            return "vendor-data";
          }
        },
      },
    },
  },
}));
