import { defineConfig } from 'vite';

export default defineConfig({
  // Capacitor serves the bundle from the filesystem, so every asset URL has
  // to be relative rather than rooted at "/".
  base: './',
  server: { host: '0.0.0.0', port: 5173 },
  build: {
    outDir: 'dist',
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
});
