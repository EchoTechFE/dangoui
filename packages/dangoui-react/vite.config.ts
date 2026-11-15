import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { readdirSync, readFileSync } from 'node:fs'
import { compile } from 'sass'
import { createThemes } from '../dangoui-design-token/theme'
import cssvars from '../dangoui/src/cssvars'
import { fromPlatte } from '../dangoui/src/button/platte'
import { themeNames } from './src/theme'

function sharedStyles() {
  const helper = createThemes({ theme: [...themeNames], defaultTheme: 'qd' })
  const declarations = (vars: Record<string, string>) =>
    Object.entries(vars)
      .map(([key, value]) => `${key}:${value};`)
      .join('\n')
  const defaults = Object.assign({}, ...Object.values(cssvars))
  let css = `.du-react {${declarations(defaults)}}\n`
  // No :root/page reset: Vue and React can coexist, including nested themes.
  for (const name of themeNames) {
    const vars = Object.fromEntries(
      Object.entries(helper.themePlatte[name].vars).map(([k, v]) => [
        `--du-${k}`,
        v,
      ]),
    )
    css += `.du-react.du-theme-${name} {${declarations(vars)}}\n`
  }
  const colors = new Set(
    Object.values(helper.themePlatte).flatMap((t) => [...t.colors]),
  )
  for (const color of colors) {
    const mapping = fromPlatte(color)
    const vars = Object.fromEntries(
      Object.entries(mapping.vars).map(([k, v]) => [
        `--du-${k}`,
        `var(--du-${v})`,
      ]),
    )
    css += `.du-react-button[data-color="${color}"] {${declarations(vars)}}\n`
  }
  // Reuse the existing, framework-independent visual rules and size variants.
  css += compile(
    resolve(__dirname, '../dangoui/src/button/style.scss'),
  ).css.replaceAll('du-button', 'du-react-button')
  css += readFileSync(resolve(__dirname, 'src/styles.css'), 'utf8')
  return css
}

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  build: {
    target: 'es2020',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'icons/index': resolve(__dirname, 'src/icons/index.ts'),
        ...Object.fromEntries(
          readdirSync(resolve(__dirname, 'src/icons'))
            .filter((f) => f.endsWith('.tsx'))
            .map((f) => [
              `icons/${f.slice(0, -4)}`,
              resolve(__dirname, `src/icons/${f}`),
            ]),
        ),
      },
      formats: ['es'],
      fileName: (_format, name) => `${name}.js`,
    },
    rollupOptions: {
      external: (id) =>
        /^(react|react-dom)(\/|$)/.test(id) || id.startsWith('@radix-ui/'),
      output: { chunkFileNames: 'internal/[name]-[hash].js' },
    },
  },
  plugins: [
    {
      name: 'shared-design-assets',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'style.css',
          source: sharedStyles(),
        })
      },
    },
  ],
})
