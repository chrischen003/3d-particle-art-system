import { defineConfig } from 'vite';

export default defineConfig({
  base: '/3d-particle-art-system/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  }
});