import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: true,
    proxy: {
      '/api':        'http://localhost:3001',
      '/verifyuser': 'http://localhost:3001',
      '/authorize':  'http://localhost:3001',
      '/transfer':   'http://localhost:3001',
      '/cancel':     'http://localhost:3001',
      '/notification': 'http://localhost:3001',
      '/lookupuser':   'http://localhost:3001',
      '/signin':       'http://localhost:3001',
    },
  },
});
