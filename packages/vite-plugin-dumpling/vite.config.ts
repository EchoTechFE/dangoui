import { defineConfig } from 'vite'
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
      external: [
        'magic-string',
        'fast-glob',
        'fs',
        'path',
        '@frontend/dumpling/platte',
        '@frontend/dumpling-design-token',
      ],
    },
    minify: false,
  },
})
