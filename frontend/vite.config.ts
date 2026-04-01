import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api':        'http://localhost:3001',
      '/verifyuser': 'http://localhost:3001',
      '/authorize':  'http://localhost:3001',
      '/transfer':   'http://localhost:3001',
      '/cancel':     'http://localhost:3001',
    },
  },
});
