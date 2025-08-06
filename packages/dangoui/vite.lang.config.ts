import { defineConfig } from 'vite'
import { resolve } from 'path'
import glob from 'fast-glob'

const localeFiles = glob.sync('src/locale/lang/*.ts')

const input = localeFiles.reduce((acc, file) => {
  const name = file.replace(/^src\/locale\/lang\//, '').replace(/\.ts$/, '')
  acc[name] = resolve(__dirname, file)
  return acc
}, {} as Record<string, string>)

export default defineConfig({
  build: {
    target: 'es2017',
    emptyOutDir: false,
    lib: {
      entry: input,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      output: [
        {
          format: 'es',
          exports: 'default',
          entryFileNames: (chunk) =>
            `${chunk.name}.mjs`,
          dir: 'dist/lang',
        },
        {
          format: 'cjs',
          exports: 'default',
          entryFileNames: (chunk) =>
            `${chunk.name}.cjs`,
          dir: 'dist/lang',
        },
      ],
    },
  },
})