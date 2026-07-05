import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:5750' } },
  build: {
    rollupOptions: {
      output: {
        // vendor code-splitting so the app shell stays small
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          motion: ['motion'],
        },
      },
    },
  },
});
