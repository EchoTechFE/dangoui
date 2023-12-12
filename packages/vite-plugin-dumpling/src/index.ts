import { Plugin } from 'vite'
import path from 'path'
import fs from 'fs'
import MagicString from 'magic-string'
import fg from 'fast-glob'

export default function plugin(): Plugin {
  const libName = '@frontend/dumpling'
  const libraryPath = path.resolve(process.cwd(), 'node_modules', libName)
  const files = fg.globSync('src/*/**.vue', {
    cwd: path.resolve(process.cwd(), `./node_modules/${libName}`),
  })

  return {
    name: 'vite-plugin-dumpling',
    transform(code: string, id: string) {
      if (id.startsWith(libraryPath) && id.endsWith('.vue')) {
        const basename = path.basename(id)
        let stylename = basename.replace(/\.vue$/, '.scss')
        let stylepath = path.resolve(path.dirname(id), stylename)
        if (!fs.existsSync(stylepath)) {
          stylepath = path.resolve(path.dirname(id), 'style.scss')
          if (!fs.existsSync(stylepath)) {
            return null
          }
        }

        let styleContent = fs.readFileSync(stylepath, 'utf-8')
        styleContent = styleContent.replace(
          /(\d+(\.\d+)?|\.\d+)px/g,
          (_, px) => {
            return `${parseFloat(px) * 2}rpx`
          },
        )
        return code + `\n<style lang="scss">\n${styleContent}\n</style>`
      }

      const importRegex = new RegExp(
        `^\\s*import\\s*{\\s*([\\w\\s,]+)\\s*}\\s*from\\s*["\']${libName}["\'];?$`,
        'gm',
      )

      if (
        !id.includes('node_modules') &&
        ['.vue', '.js', '.ts'].some((ext) => id.endsWith(ext))
      ) {
        const s = new MagicString(code)
        s.replace(importRegex, (_: string, $1: string) => {
          const imports: { name: string; alias: string }[] = []
          $1.split(',')
            .map((s) => s.trim())
            .forEach((s) => {
              if (s.includes(' as ')) {
                const [name, alias] = s.split(' as ').map((item) => item.trim())
                imports.push({
                  name,
                  alias,
                })
              } else {
                imports.push({
                  name: s,
                  alias: s,
                })
              }
            })

          return imports
            .map((i) => {
              // TODO: 优化这个逻辑
              if (i.name === 'globalConfig') {
                return `import ${i.alias} from '${libName}/src/plugins/globalConfig.ts';`
              }

              const pkg = files.find((file) => {
                const component = file
                  .split('/')!
                  .pop()!
                  .replace(/\.vue$/, '')
                if (i.name.startsWith('Du')) {
                  return 'Du' + component === i.name
                }
                return component === i.name
              })
              return `import ${i.alias} from '${libName}/${pkg}';`
            })
            .join('\n')
        })

        if (s.hasChanged()) {
          return {
            code: s.toString(),
            map: s.generateMap({
              source: id,
              file: id + '.map',
              hires: true,
            }),
          }
        }
      }
    },
  }
}
