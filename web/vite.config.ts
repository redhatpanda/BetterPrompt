import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Output directory for Chrome extension
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: "index.html", // React UI (Popup)
        background: "src/background.ts", // Background script
        content: "src/content.ts",
        inject:"src/inject.tsx" // Content script
      },
      output: {
        format: "esm", // Use "esm" for Chrome Extension compatibility
        entryFileNames: "[name].js", // Ensures correct file names
        chunkFileNames: "[name]-[hash].js", // Avoids Rollup conflicts
        assetFileNames: "[name].[ext]"
      }
    }
  }
});
