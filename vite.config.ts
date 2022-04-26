import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@src': resolve('src'),
      '@views': resolve('src/views'),
      '@components': resolve('src/components'),
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:1229',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  }
})
