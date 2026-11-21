import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@project/components/ui': path.resolve(__dirname, './src/components/ui'),
      '@project/components/lib': path.resolve(__dirname, './src/lib'),
      '@project/components/hooks': path.resolve(__dirname, './src/hooks'),
      '@project/components': path.resolve(__dirname, './src/components'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
});
