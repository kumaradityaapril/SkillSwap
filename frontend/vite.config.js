import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': process.env.VITE_API_URL || 'http://localhost:5003',
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          'react-toastify': ['react-toastify']
        }
      }
    },
  },
  base: './',
  optimizeDeps: {
    include: ['react-toastify']
  }
})
