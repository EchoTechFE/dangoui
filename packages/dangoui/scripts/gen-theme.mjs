import cssvars from '../dist/cssvars.mjs'
import fs from 'fs'
import { createThemes } from 'dangoui-design-token'
import fromPlatte from '../dist/platte.mjs'

const themeHelper = createThemes({
  theme: ['qd', 'qdm', 'mihua-dark', 'mihua-light', 'qh'],
  defaultTheme: 'qd',
})

const result = []

Object.entries(cssvars.Global).map((item) => {
  return result.push(`${item[0]}: ${item[1]};`)
})

Object.keys(cssvars)
  .filter((key) => key != 'Global')
  .map((key) => {
    Object.entries(cssvars[key]).map((item) => {
      return result.push(`${item[0]}: ${item[1]};`)
    })
  })

const colorSet = new Set()
Object.keys(themeHelper.themePlatte).forEach((key) => {
  const theme = themeHelper.themePlatte[key]
  theme.colors.forEach((c) => {
    colorSet.add(c)
  })
})

const designTokenCss = themeHelper.generateCss()

let componentColorsCss = ''

colorSet.forEach((c) => {
  Object.values(fromPlatte).forEach((fn) => {
    const config = fn(c)
    componentColorsCss =
      componentColorsCss +
      `.${config.name} {\n${Object.entries(config.vars)
        .map(([key, value]) => `--du-${key}:var(--du-${value});`)
        .join('\n')}\n}\n`
  })
})

const iconfont = fs.readFileSync('./src/icon/iconfont.css', 'utf-8')

const globalCss = fs.readFileSync('./src/global.css', 'utf-8')

fs.writeFileSync(
  './dist/theme.css',
  `:root {\n${result.join(
    '\n',
  )}\n}\n${designTokenCss}\n${componentColorsCss}\n${iconfont}\n${globalCss}`,
)
fs.writeFileSync(
  './dist/mp/theme.css',
  `page {\n${result.join(
    '\n',
  )}\n}\n${designTokenCss}\n${componentColorsCss}\n${iconfont}\n${globalCss}`,
)
