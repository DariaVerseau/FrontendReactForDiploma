import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite.config.js
export default defineConfig({
   plugins: [
    react({
      jsxRuntime: 'automatic', // Включает новый JSX трансформер
      jsxImportSource: 'react'
    })
  ],
  server: {
    port: 3000,
    host: 'localhost',
    hmr: {
      // Принудительно указываем, где искать HMR-сокет
      protocol: 'ws',
      host: 'localhost',
      port: 5173, // ← HMR будет слушать 5173, а сайт — 3000
    },
    proxy: {
      // Все API-запросы проксируем на Go
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/ml': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});