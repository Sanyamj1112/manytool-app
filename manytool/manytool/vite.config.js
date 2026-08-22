import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()], // PWA plugin ko filhal hata diya hai debug karne ke liye
  server: {
    port: 5173,
    host: true,
    open: true,
    cors: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Build aur OptimizeDeps ko filhal comment out kar do, debugging mein madad milegi
});