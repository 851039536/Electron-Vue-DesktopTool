import { rmSync } from 'fs';
import { type Plugin, defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import pkg from './package.json';
import Unocss from 'unocss/vite';
import presetUno from '@unocss/preset-uno';
import presetAttributify from '@unocss/preset-attributify';
import Components from 'unplugin-vue-components/vite'; // 针对 Vue 的按需组件自动导入
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import transformerDirective from '@unocss/transformer-directives';
rmSync('dist-electron', { recursive: true, force: true });
const sourcemap = !!process.env.VSCODE_DEBUG;
const isBuild = process.argv.slice(2).includes('build');

// Load .env
function loadEnvPlugin(): Plugin {
  return {
    name: 'vite-plugin-load-env',
    config(config, env) {
      const root = config.root ?? process.cwd();
      const result = loadEnv(env.mode, root);
      // Remove the vite-plugin-electron injected env.
      delete result.VITE_DEV_SERVER_URL;
      config.esbuild ??= {};
      config.esbuild.define = {
        ...config.esbuild.define,
        ...Object.fromEntries(Object.entries(result).map(([key, val]) => [`process.env.${key}`, JSON.stringify(val)]))
      };
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Unocss({
      transformers: [transformerDirective()],
      presets: [presetUno(), presetAttributify()]
    }),
    AutoImport({
      // 自动导入vue3的hooks
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          axios: [
            ['default', 'axios'] // import { default as axios } from 'axios',
          ]
        }
      ],
      // 可以在这自定义自己的东西，比如接口api的引入，工具函数等等
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      // 针对 Vue 的按需组件自动导入
      dts: true, // ts支持
      dirs: ['src/components', 'src/views'], // 自定义路径按需导入
      resolvers: [ElementPlusResolver()] // 直接使用组件,无需在任何地方导入组件
    }),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main/index.ts',
        onstart(options) {
          if (process.env.VSCODE_DEBUG) {
            console.log(/* For `.vscode/.debug.script.mjs` */ '[startup] Electron App');
          } else {
            options.startup();
          }
        },
        vite: {
          build: {
            sourcemap,
            minify: isBuild,
            outDir: 'dist-electron/main',
            rollupOptions: {
              external: Object.keys(pkg.devDependencies)
            }
          },
          plugins: [loadEnvPlugin()]
        }
      },
      {
        entry: 'electron/preload/index.ts',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload();
        },
        vite: {
          build: {
            sourcemap,
            minify: isBuild,
            outDir: 'dist-electron/preload',
            rollupOptions: {
              external: Object.keys(pkg.devDependencies)
            }
          }
        }
      }
    ]),
    // Use Node.js API in the Renderer-process
    renderer({
      nodeIntegration: true
    })
  ],
  resolve: {
    // 配置别名
    extensions: ['.vue', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.node', '.scss'],
    alias: {
      '@': resolve('./src'),
      '@comp': resolve('./src/components'),
      '@vi': resolve('./src/views'),
      '@api': resolve('./src/api'),
      '@h': resolve('./src/hooks'),
      '@assets': resolve('./src/assets')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: true // 避免出现: build时的 @charset 必须在第一行的警告
        // additionalData: '@import "./src/design/methodCss.scss";' // 添加公共样式
      }
      // less: {
      //   javascriptEnabled: true
      // }
    }
  },
  server: process.env.VSCODE_DEBUG
    ? (() => {
        const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
        return {
          host: url.hostname,
          port: +url.port
        };
      })()
    : undefined,
  clearScreen: false
});
