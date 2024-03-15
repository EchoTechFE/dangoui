import { Plugin } from 'vite'
import path from 'path'
import fs from 'fs'
import MagicString from 'magic-string'
import fg from 'fast-glob'
import { createThemes } from '@frontend/dumpling-design-token'
import fromPlatte from '@frontend/dumpling/platte'
import cssvars from '@frontend/dumpling/cssvars'

function kebab(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\B([A-Z]+)/g, '-$1')
    .toLowerCase()
}

type PluginOptions = {
  /**
   * 开启虚拟化组件节点
   */
  virtualHost?: boolean | ((path: string) => boolean)
  /**
   * 指定主题，与 globalConfig 中保持一致
   *
   * ？？如果么有动态需求，并且希望性能更加好，可以使用 globalConfig
   */
  themes?: (
    | {
        name: string
        colors: Record<
          string,
          {
            solidBg?: string
            solidDisabledtempBg?: string
            solidColor?: string
            solidDisabledTempColor?: string
            textColor?: string
            textDisabledtempColor?: string
            border?: string
            disabledTempBorder?: string
            outlineColor?: string
            outlineDisabledtempColor?: string
            color?: string
            disabledtempColor?: string
            softBg?: string
            softDisabledtempBg?: string
            button?: {
              solidBg?: string
              solidDisabledtempBg?: string
              solidColor?: string
              solidDisabledTempColor?: string
              textColor?: string
              textDisabledtempColor?: string
              border?: string
              disabledTempBorder?: string
              outlineColor?: string
              outlineDisabledtempColor?: string
              color?: string
              disabledtempColor?: string
              softBg?: string
              softDisabledtempBg?: string
            }
          }
        >
      }
    | 'qd'
    | 'qh'
    | 'qdm'
    | 'mihua-dark'
    | 'mihua-light'
  )[]
}

export function resolveThemes(themes: PluginOptions['themes'] = []) {
  return themes.map((t) => {
    if (typeof t === 'string') {
      return t
    }

    const colors: Record<string, Record<string, string | number>> = {}

    function getComponentName(name: string) {
      switch (name) {
        case 'button':
          return 'bt'
        default:
          return name
      }
    }

    Object.entries(t.colors).forEach(([colorName, colorSet]) => {
      colors[colorName] = {}
      Object.entries(colorSet).forEach(([varName, varVal]) => {
        if (typeof varVal === 'string') {
          colors[colorName][kebab(varName)] = varVal
        } else {
          Object.entries(varVal).forEach(([subVarName, subVarVal]) => {
            colors[colorName][
              `${getComponentName(varName)}-${kebab(subVarName)}`
            ] = subVarVal
          })
        }
      })
    })

    return {
      name: t.name,
      colors,
    }
  })
}

export default function plugin(options: PluginOptions = {}): Plugin {
  const libName = '@frontend/dumpling'
  const libraryPath = path.resolve(process.cwd(), 'node_modules', libName)
  const components = fg.globSync('src/*/**.vue', {
    cwd: path.resolve(process.cwd(), `./node_modules/${libName}`),
  })
  const composables = fg.globSync('src/composables/*/**.ts', {
    cwd: path.resolve(process.cwd(), `./node_modules/${libName}`),
  })

  const themes = resolveThemes(
    options.themes ??
      (['qd', 'qh', 'qdm', 'mihua-dark', 'mihua-light'] as const),
  )

  const themeHelper = createThemes({
    theme: themes,
    defaultTheme: 'qd',
  })

  const VIRTUAL_DUMPLING_THEME = 'virtual:dumpling-theme.css'

  return {
    name: 'vite-plugin-dumpling',
    config() {
      return {
        define: {
          __WEB__: `${process.env.UNI_PLATFORM === 'h5'}`,
          __UNI_PLATFORM__: `"${process.env.UNI_PLATFORM || ''}"`,
        },
      }
    },

    resolveId(source: string) {
      if (source === VIRTUAL_DUMPLING_THEME) {
        return VIRTUAL_DUMPLING_THEME
      }
      return null
    },

    load(id: string) {
      if (id === VIRTUAL_DUMPLING_THEME) {
        const iconfont = fs.readFileSync(
          path.resolve(libraryPath, 'src/icon/iconfont.css'),
        )
        const globalCss = fs.readFileSync(
          path.resolve(libraryPath, 'src/global.css'),
        )
        const result: string[] = []

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
        const legacyCssVars = `:root,page{\n${result.join('\n')}\n}`
        const designTokenCss = themeHelper.generateCss()
        return `${legacyCssVars}\n${designTokenCss}\n${iconfont}\n${globalCss}\n`
      }
      return null
    },

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
        if (stylepath.includes('switch')) {
          styleContent = styleContent.replace(
            /(\d+(\.\d+)?|\.\d+)px/g,
            (_, px) => {
              return `${((parseFloat(px) * 100) / 375).toFixed(8)}vw`
            },
          )
        } else {
          styleContent = styleContent.replace(
            /(\d+(\.\d+)?|\.\d+)px/g,
            (_, px) => {
              return `${parseFloat(px) * 2}rpx`
            },
          )
        }

        if (fs.existsSync(path.resolve(path.dirname(id), 'host.css'))) {
          const hostCss = fs.readFileSync(
            path.resolve(path.dirname(id), 'host.css'),
            'utf-8',
          )
          styleContent = `${hostCss}\n${styleContent}`
        }

        const componentName = basename.replace(/\.vue$/, '')
        if (fromPlatte[componentName]) {
          const colorSet = new Set<string>()
          const themeNames = Object.keys(themeHelper.themePlatte)
          themeNames.forEach((themeName) => {
            themeHelper.themePlatte[themeName].colors.forEach((c) => {
              colorSet.add(c)
            })
          })
          colorSet.forEach((c) => {
            const config = fromPlatte[componentName](c)
            Object.entries(config.vars).forEach(([key, value]) => {
              themeHelper.addAlias(key)
              themeHelper.addAlias(value)
            })
          })
          styleContent = styleContent.replace(/var\(--du-(.*)\)/g, (_, $1) => {
            if (themeHelper.hasAlias($1)) {
              return `var(--dva-${themeHelper.getAlias($1)})`
            }
            return _
          })
          colorSet.forEach((c) => {
            const config = fromPlatte[componentName](c)
            const configCss = Object.entries(config.vars)
              .map(([key, value]) => {
                const k = themeHelper.hasAlias(key)
                  ? `--dva-${themeHelper.getAlias(key)}`
                  : `--du-${key}`
                const v = themeHelper.hasAlias(value)
                  ? `--dva-${themeHelper.getAlias(value)}`
                  : `--du-${value}`
                return `${k}: var(${v});`
              })
              .join('\n')
            styleContent += `.${config.name} {\n${configCss}\n}`
          })

          // TODO: 测试 Button 组件
          if (componentName === 'Button') {
            Object.entries(themeHelper.themePlatte).forEach(
              ([themeName, theme]) => {
                const groups: Record<string, string[]> = {}
                Object.entries(theme.vars)
                  .filter(([key]) => {
                    return key.includes('-bt-')
                  })
                  .forEach(([key, value]) => {
                    const color = key.split('-')[0]
                    if (!groups[color]) {
                      groups[color] = []
                    }
                    let buttonVarName = key.split('-').slice(1).join('-')
                    buttonVarName = themeHelper.hasAlias(buttonVarName)
                      ? `--dva-${themeHelper.getAlias(buttonVarName)}`
                      : `--du-${buttonVarName}`

                    groups[color].push(`${buttonVarName}: ${value};`)
                  })
                Object.entries(groups).forEach(([color, vars]) => {
                  styleContent += `.du-theme-${themeName} .du-c-${color}-bt {\n${vars.join(
                    '\n',
                  )}\n}`
                })
              },
            )
          }
        }

        code += `\n<style lang="scss">\n${styleContent}\n</style>`

        let virtualHostOn = false

        if (typeof options.virtualHost === 'function') {
          virtualHostOn = options.virtualHost(id)
        } else {
          virtualHostOn = !!options.virtualHost
        }

        if (virtualHostOn && !code.includes('virtualHost')) {
          const virtualHostScript = `
<script lang="ts">
export default {
  options: {
    virtualHost: true,
  },
}
</script>
`
          code += `\n${virtualHostScript}`
        }

        return code
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
              if (s === '') {
                return
              }

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

              const pkg = components.find((file) => {
                const component = file
                  .split('/')!
                  .pop()!
                  .replace(/\.vue$/, '')
                if (i.name.startsWith('Du')) {
                  return 'Du' + component === i.name
                }
                return component === i.name
              })
              if (pkg) {
                return `import ${i.alias} from '${libName}/${pkg}';`
              }
              const composable = composables.find((file) => {
                const functionName = file
                  .split('/')!
                  .pop()!
                  .replace(/\.ts$/, '')
                return functionName === i.name
              })
              if (composable) {
                if (i.alias !== i.name) {
                  return `import { ${i.name} as ${i.alias} } from '${libName}/${composable}';`
                }
                return `import { ${i.name} } from '${libName}/${composable}';`
              }

              return ''
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
