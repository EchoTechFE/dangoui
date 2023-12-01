import cssvars from '../dist/cssvars.mjs'
import fs from 'fs'

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

const iconfont = fs.readFileSync('./src/icon/iconfont.css', 'utf-8')

fs.writeFileSync(
  './dist/theme.css',
  `:root {\n${result.join('\n')}\n}\n${iconfont}`,
)
fs.writeFileSync(
  './dist/mp/theme.css',
  `page {\n${result.join('\n')}\n}\n${iconfont}`,
)
