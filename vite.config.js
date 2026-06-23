import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // Vite-ga ichki PostCSS tizimini butunlay chetlab o'tishni buyuramiz
    postcss: {
      plugins: []
    }
  }
})