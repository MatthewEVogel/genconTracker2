import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // anything your app calls on /api/* will be forwarded
      // to https://www.gencon.com/*
      '/api': {
        target: 'https://www.gencon.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
