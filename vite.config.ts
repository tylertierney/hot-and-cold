import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      workbox: {
        maximumFileSizeToCacheInBytes: 25_000_000,
      },
      registerType: 'autoUpdate',
      manifest: {
        name: 'Hot and Cold',
        short_name: 'Hot and Cold',
        display: 'fullscreen',
        description: 'Guess the word in as few guesses as possible',
        background_color: '#1f232e',
        icons: [
          {
            src: '/hot-and-cold.svg',
            sizes:
              '48x48 72x72 96x96 120x120 128x128 144x144 180x180 256x256 512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/hot-and-cold.svg',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
        theme_color: '#1f232e',
      },
    }),
  ],
  server: {
    host: '192.168.254.167',
    port: 3000,
  },
})
