import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import UnoCSS from '@unocss/vite'
import { presetEcho } from 'unocss-preset-echo'

export default defineConfig({
  root: resolve(__dirname, '.'),
  esbuild: { jsx: 'automatic' },
  plugins: [UnoCSS({ presets: [presetEcho({ unit: 'px' })] })],
  resolve: {
    dedupe: ['react', 'react-dom'],
    // Vite 5 does not resolve a package's own name from inside that package.
    // These aliases target built artifacts; the tarball check verifies exports separately.
    alias: [
      {
        find: /^dangoui-react\/icons\/(.+)$/,
        replacement: resolve(__dirname, '../dist/icons/$1.js'),
      },
      {
        find: 'dangoui-react/style.css',
        replacement: resolve(__dirname, '../dist/style.css'),
      },
      {
        find: /^dangoui-react$/,
        replacement: resolve(__dirname, '../dist/index.js'),
      },
    ],
  },
  server: { host: '127.0.0.1' },
})
