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

fs.writeFileSync('./dist/theme.css', `:root {\n${result.join('\n')}\n}`)
