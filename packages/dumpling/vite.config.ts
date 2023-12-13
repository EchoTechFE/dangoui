import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  build: {
    target: 'es2017',
    lib: {
      entry: [
        resolve(__dirname, 'src/index.ts'),
        resolve(__dirname, 'src/cssvars.ts'),
      ],
      fileName: (format, entryName) => {
        const extension = format === 'es' ? 'mjs' : 'cjs'
        return `${entryName}.${extension}`
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [vue()],
  define: {
    __WEB__: 'true',
    __UNI_PLATFORM__: '"h5"',
  },
})
