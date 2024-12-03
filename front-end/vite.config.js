import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}, // Optional: Fixes compatibility issues if necessary
  },
  // Remove the proxy configuration for production deployment
});
