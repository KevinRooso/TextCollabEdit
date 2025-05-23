import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow external access
    port: process.env.PORT || 5173,
    proxy: {
      // Proxy requests starting with /gist to the Gist API
      '/gist': {
        target: 'https://gist.github.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gist/, ''), // remove '/gist' from the beginning of the path
      },
    },
  },
  preview: {
    allowedHosts: ['textcollabedit.onrender.com'],
  },
});
