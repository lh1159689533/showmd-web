import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import WindiCSS from 'vite-plugin-windicss'
// import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // visualizer({
    //   open: true,
    // }),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          enabledCollections: ['ep'],
        }),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
    WindiCSS(),
  ],
  resolve: {
    alias: {
      '@src': resolve('src'),
      '@views': resolve('src/views'),
      '@components': resolve('src/components'),
      '@plugins': resolve('src/plugins'),
      '@utils': resolve('src/utils'),
      '@service': resolve('src/service'),
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
