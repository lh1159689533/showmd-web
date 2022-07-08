import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@src': resolve('src'),
      '@views': resolve('src/views'),
      '@components': resolve('src/components'),
      '@plugins': resolve('src/plugins'),
      '@utils': resolve('src/utils'),
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:1229',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/showmd/img': {
        target: 'http://localhost:1229',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/showmd/, '')
      },
    }
  }
})
