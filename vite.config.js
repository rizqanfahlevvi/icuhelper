import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'
import { glob } from 'glob'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Collect all HTML files as MPA entry points
const htmlFiles = glob.sync('**/*.html', {
  cwd: __dirname,
  ignore: ['node_modules/**', 'dist/**']
})

const input = Object.fromEntries(
  htmlFiles.map(file => [
    file.replace(/\.html$/, '').replace(/[/\\]/g, '_'),
    path.resolve(__dirname, file)
  ])
)

export default defineConfig({
  root: '.',
  base: '/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      input,
      output: {
        entryFileNames: 'assets/js/[name].[hash].js',
        chunkFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: ({ name }) => {
          if (!name) return 'assets/[hash][extname]'
          if (/\.css$/i.test(name)) return 'assets/css/[name].[hash][extname]'
          if (/\.(png|jpe?g|svg|ico|webp)$/i.test(name)) return 'assets/img/[name][extname]'
          return 'assets/[name].[hash][extname]'
        }
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null,
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{html,css,js}'],
        runtimeCaching: [
          {
            urlPattern: /\/assets\/data\//,
            handler: 'NetworkFirst',
            options: { cacheName: 'data-cache' }
          },
          {
            urlPattern: /\/assets\/js\//,
            handler: 'NetworkFirst',
            options: { cacheName: 'js-cache' }
          },
          {
            urlPattern: /\/assets\/css\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'css-cache',
              expiration: { maxAgeSeconds: 604800 }
            }
          }
        ]
      }
    })
  ]
})
