import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    target: 'es2017',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'dangoui-icon-config',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    minify: false,
  },
  define: {
    __WEB__: 'true',
    __UNI_PLATFORM__: '"h5"',
  },
})
