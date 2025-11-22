// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "NutriVision",
        short_name: "NutriVision",
        description: "Track your nutrition & stay healthy with NutriVision",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "nutrivision-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "nutrivision-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "nutrivision-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    })
    ],
    build: {
      // Mengaktifkan kompresor Terser
      minify: 'terser', 
      terserOptions: {
        compress: {
          // Secara otomatis menghapus semua console.* (log, warn, error, dll.)
          drop_console: true, 
          // Opsional: Menghapus statement debugger
          drop_debugger: true,
        },
      },
    },
    
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
})