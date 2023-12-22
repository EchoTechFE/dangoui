import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  build: {
    target: 'es2017',
    lib: {
      entry: resolve(__dirname, 'theme.ts'),
      name: 'dumpling-design-token',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    minify: false,
  },
})
