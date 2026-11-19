import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' - относительные пути, чтобы одна и та же сборка работала
// и как popup расширения Chrome, и как веб-страница.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  test: {
    // Генераторы, валидаторы, справочники и хранилище не требуют DOM.
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
})
