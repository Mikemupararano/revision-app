import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build"
  },
  css: {
    modules: {
      localsConvention: "camelCase"
    }
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
  base: "/revision-app/"
});
