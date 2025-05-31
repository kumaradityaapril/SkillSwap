import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    })
  ].filter(Boolean),
  
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: mode === 'production' ? 'https://skilldep.onrender.com' : 'http://localhost:3000',
        changeOrigin: true,
        secure: mode !== 'production',
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('X-Requested-With', 'XMLHttpRequest');
          });
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = mode === 'production' ? 'https://skilldep.onrender.com' : 'http://localhost:5173';
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
          });
        }
      },
      '/socket.io': {
        target: mode === 'production' ? 'https://skilldep.onrender.com' : 'http://localhost:3000',
        ws: true,
        changeOrigin: true,
        secure: mode !== 'production'
      }
    },
    cors: {
      origin: mode === 'production' ? 'https://skilldep.onrender.com' : 'http://localhost:5173',
      credentials: true
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: mode === 'production',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          form: ['formik', 'yup'],
          ui: ['@headlessui/react', '@heroicons/react'],
          'react-toastify': ['react-toastify']
        },
      },
    },
  },
  
  base: '/',
  
  preview: {
    port: 4173,
    strictPort: true,
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-toastify']
  },
}));
