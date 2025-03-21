import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", 
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: "index.html", 
        background: "src/background.ts", 
        content: "src/content.ts",
        inject:"src/inject.tsx" 
      },
      output: {
        format: "esm", 
        entryFileNames: "[name].js", 
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "[name].[ext]"
      }
    }
  }
});
