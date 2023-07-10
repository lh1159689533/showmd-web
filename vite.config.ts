import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import WindiCSS from 'vite-plugin-windicss'
import { visualizer } from "rollup-plugin-visualizer";
import importToCDN from 'vite-plugin-cdn-import';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monacoEditorPlugin({}),
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
    importToCDN({
      prodUrl: 'https://cdn.bootcdn.net/ajax/libs/{path}',
      // prodUrl: 'https://unpkg.com/{path}',
      modules: [
        {
          name: '@wangeditor/editor',
          var: 'wangEditor',
          path: 'wangeditor5/5.1.23/index.min.js',
          css: 'wangeditor5/5.1.23/css/style.min.css'
        },
        {
          name: 'vditor',
          var: 'Vditor',
          path: 'vditor/3.9.0/index.min.js',
          css: 'vditor/3.9.0/index.min.css',
        },
      ]
    })
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
        // target: 'http://119.8.232.109:1229',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/showmd/img': {
        // target: 'http://localhost:1229',
        target: 'http://119.8.232.109:1229',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/showmd/, '')
      },
    }
  }
})
