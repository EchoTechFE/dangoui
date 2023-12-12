import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  build: {
    target: 'es2017',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'vite-plugin-dumpling',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['magic-string', 'fast-glob', 'fs', 'path'],
    },
    minify: false,
  },
})
