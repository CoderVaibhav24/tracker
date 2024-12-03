// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // Your backend server
        changeOrigin: true,
        secure: false, // Set to true if your backend uses HTTPS
        // Optional: Rewrite the URL path if necessary
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
