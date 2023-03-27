import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import ElementPlus from 'unplugin-element-plus/vite';
import topLevelAwait from "vite-plugin-top-level-await";
import Unocss from 'unocss/vite'
// import nodePolyfills from 'rollup-plugin-node-polyfills';
// import commonjs from '@rollup/plugin-commonjs';
// import { svelte } from '@sveltejs/vite-plugin-svelte';
// import dynamicImport from 'vite-plugin-dynamic-import';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
// import { builtinModules } from 'node:module';

// const builtins = builtinModules.filter(m => !m.startsWith('_')); builtins.push(...builtins.map(m => `node:${m}`));
// console.log(builtins);
const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  // optimizeDeps: {
  //   include: ['axios'],
  // },
  define: {
    'process.env': {},
    'process.versions.electron': {},
    "global.TYPED_ARRAY_SUPPORT": {},
  },
  build: {
    rollupOptions: {
      external: ["fs", "path", "stream"],
   
    },
  
    commonjsOptions: {
      include: [/node_modules/],
    },
  },

  // build: {
  //   modulePreload: { 
  //     polyfill: false 
  //   }
  // },
  server: {
    host: "0.0.0.0",
    port: 15173,
    cors: {
      origin: ["null","http://localhost:15173","http://localhost:9000","https://elpsykongroo.com","http://127.0.0.1:15173","https://elpsykongroo.com"],
      credentials: true
    }
    // proxy: {
    //   "/": {
    //   target: "http://localhost:8443",
    //   changeOrigin: true,
    //   secure: false,
    //     // rewrite: (path) => path.replace(/^\/oauth2/, ""),
    //  }
    // }
    // proxy: {
    //   "^/oauth2": {
    //     target: "https://auth.elpsykongroo.com",
    //     changeOrigin: true,
    //     secure: false,
    //     // rewrite: (path) => path.replace(/^\/oauth2/, ""),
    //   },
    //   "^/public": {
    //     target: "https://api.elpsykongroo.com",
    //     changeOrigin: true,
    //     secure: false,
    //     // rewrite: (path) => path.replace(/^\/public/, ""),
    //   },
    //   "^/ip": {
    //     target: "https://api.elpsykongroo.com",
    //     changeOrigin: true,
    //     secure: false,
    //     // rewrite: (path) => path.replace(/^\/public/, ""),
    //   },
    //   "^/record": {
    //     target: "https://api.elpsykongroo.com",
    //     changeOrigin: true,
    //     secure: false,
    //     // rewrite: (path) => path.replace(/^\/public/, ""),
    //   },
    // }
  },
  resolve: {
    alias: {
      '~/': `${pathSrc}/`,
      // svelte: require.resolve('@sveltejs/vite-plugin-svelte'),
      // fs: 'rollup-plugin-node-polyfills/polyfills/fs',
      // // '': require.resolve(''),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element/index.scss" as *;`,
      },
    },
  },
  plugins: [
    // nodeResolve({ preferBuiltins: false }),
    // nodeResolve({
    //   dedupe: ["is-plain-object", "false"]
    // }),
    viteCommonjs(),
    // svelte({
    //   ignorePluginPreprocessors: true
    // }),
    // commonjs({
    //   requireReturnsDefault: "auto",
    // }),

    // nodePolyfills(
    //   {
    //     "fs": true
    //   },
    // ),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`
    }),
    ElementPlus({

    }),
    vue(),
    AutoImport({
      include: [
        /\.[t]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/, /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      // Auto import functions from Vue, e.g. ref, reactive, toRef...
      imports: ['vue'],

      // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
      resolvers: [
        ElementPlusResolver(),

        // Auto import icon components
        IconsResolver({
          prefix: 'Icon',
        }),
      ],

      dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
    }),

    Components({
      resolvers: [
        // Auto register icon components
        IconsResolver({
          enabledCollections: ['ep'],
        }),
        // Auto register Element Plus components
        ElementPlusResolver(),
      ],

      dts: path.resolve(pathSrc, 'components.d.ts'),
    }),

    Icons({
      autoInstall: true,
    }),

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
