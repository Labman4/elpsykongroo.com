import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import Unocss from 'unocss/vite'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    cors: true, // 默认启用并允许任何源
    proxy: {
      "^/oauth2": {
        target: "https://auth.elpsykongroo.com",
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/oauth2/, ""),
      },
      "^/public": {
        target: "https://api.elpsykongroo.com",
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/public/, ""),
      },
      "^/ip": {
        target: "https://api.elpsykongroo.com",
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/public/, ""),
      },
      "^/record": {
        target: "https://api.elpsykongroo.com",
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/public/, ""),
      },
    }
  },
  resolve: {
    alias: {
      '~/': `${pathSrc}/`,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element/index.scss" as *;`,
      },
    },
  },
  optimizeDeps: {
    include: ['axios'],
  },
  plugins: [
    vue(),
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
      dts: 'src/components.d.ts',
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss({
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
          scale: 1.2,
          warn: true,
        }),
      ],
      transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
      ]
    }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
      svgoOptions: false,

      /**
       * 自定义插入位置
       * @default: body-last
       */
      // inject?: 'body-last' | 'body-first'

      /**
       * custom dom id
       * @default: __svg__icons__dom__
       */
      // customDomId: '__svg__icons__dom__',
    }),
  ],
})
