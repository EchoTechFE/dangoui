import chroma from 'chroma-js'
import { kebabCase } from 'lodash-es'
import mihuaThemes from './mihua-platte.json' assert { type: 'json' }
import themes from './platte.json' assert { type: 'json' }

type ThemeConfig = {
  name: string
  colors: Record<string, Record<string, string | number>>
}

type CreateThemeOpts = {
  theme: Array<ThemeConfig | 'qd' | 'qh' | 'qdm' | 'mihua-light' | 'mihua-dark'>
  defaultTheme: string
}

// 后面抽离出去，目前先做迁移工作
const builtinTheme: ThemeConfig[] = [
  {
    name: 'qd',
    colors: {
      vip: {
        'solid-bg': '#000',
        'solid-disabledtemp-bg': '#0000001F',

        'solid-color': '#FFBF8F',
        'solid-disabledtemp-color': '#FFFFFF',

        'text-color': '#800C00',
        'text-disabledtemp-color': '#FBAFA6',

        border: '#800C00',
        'disabledtemp-border': '#FFC299',

        'outline-color': '#800C00',
        'outline-disabledtemp-color': '#FFC299',

        color: '#800C00',
        'disabledtemp-color': '#FBAFA6',

        'soft-bg': '#FFD7B8',
        'soft-disabledtemp-bg': '#FFEADB',
      },
    },
  },

  {
    name: 'qh',
    colors: {
      primary: {
        'solid-bg': '#FF812C',
        'solid-disabledtemp-bg': '#FFBF8F',

        'solid-color': '#fff',
        'solid-disabledtemp-color': '#fff',

        'text-color': '#FF812C',
        'text-disabledtemp-color': '#FFBF8F',

        border: '#FF812C',
        'disabledtemp-border': '#FFBF8F',

        'outline-color': '#FF812C',
        'outline-disabledtemp-color': '#FFBF8F',

        color: '#FF812C',
        'disabledtemp-color': '#FFBF8F',

        'soft-bg': '#FFEADB',
        'soft-disabledtemp-bg': '#FFEADB',
      },
    },
  },

  {
    name: 'qdm',
    colors: {
      primary: {
        'solid-bg': '#1677FF',
        'solid-disabledtemp-bg': '#91CAFF',

        'solid-color': '#fff',
        'solid-disabledtemp-color': '#fff',

        'text-color': '#1677FF',
        'text-disabledtemp-color': '#91CAFF',

        border: '#1677FF',
        'disabledtemp-border': '#91CAFF',

        'outline-color': '#1677FF',
        'outline-disabledtemp-color': '#91CAFF',

        color: '#1677FF',
        'disabledtemp-color': '#91CAFF',

        'soft-bg': '#E6F4FF',
        'soft-disabledtemp-bg': '#E6F4FF',
      },
    },
  },
]

let i = 0
function nextVarName() {
  return (i++).toString(36)
}

const base: Record<string, Record<string | number, string>> = {
  white: {
    100: 'rgba(255,255,255,0.04)',
    200: 'rgba(255,255,255,0.08)',
    300: 'rgba(255,255,255,0.12)',
    400: 'rgba(255,255,255,0.16)',
    500: 'rgba(255,255,255,0.24)',
    600: 'rgba(255,255,255,0.40)',
    700: 'rgba(255,255,255,0.64)',
    800: 'rgba(255,255,255,0.88)',
    900: '#fff',
    DEFAULT: '#fff',
  },

  neutral: {
    100: 'rgba(0,0,0,0.04)',
    200: 'rgba(0,0,0,0.08)',
    300: 'rgba(0,0,0,0.12)',
    400: 'rgba(0,0,0,0.16)',
    500: 'rgba(0,0,0,0.24)',
    600: 'rgba(0,0,0,0.40)',
    700: 'rgba(0,0,0,0.64)',
    800: 'rgba(0,0,0,0.88)',
    900: '#000',
    DEFAULT: '#000',
  },

  purplegray: {
    100: '#f7f7f9',
    200: '#ededf2',
    300: '#e1e1e5',
    400: '#d4d0da',
    500: '#bab5c4',
    600: '#918b9f',
    700: '#625e76',
    800: '#383950',
    900: '#2b263b',
  },

  grape: {
    100: '#f1e6ff',
    200: '#ebd4ff',
    300: '#d6b3ff',
    400: '#b688ff',
    500: '#ad69f7',
    600: '#8a4fd1',
    700: '#6838ab',
    800: '#4a2585',
    900: '#32195e',
  },

  blue: {
    100: '#e4ebf9',
    200: '#cce0ff',
    300: '#a6caff',
    400: '#8fb7ff',
    500: '#6c9aff',
    600: '#5077d9',
    700: '#3957b3',
    800: '#263c8c',
    900: '#1b2866',
  },

  zimablue: {
    100: '#dff7f7',
    200: '#cbf7f7',
    300: '#9df2f4',
    400: '#62deef',
    500: '#28bee0',
    600: '#009bbf',
    700: '#087599',
    800: '#005273',
    900: '#00344d',
  },

  turquoise: {
    100: '#e2f7f3',
    200: '#cdf9eb',
    300: '#9dedd9',
    400: '#77e5d2',
    500: '#36ccb6',
    600: '#17ad9b',
    700: '#14877e',
    800: '#076059',
    900: '#053b3a',
  },

  green: {
    100: '#e2f7e3',
    200: '#c9f2ca',
    300: '#9de09d',
    400: '#7ad37f',
    500: '#52ba5c',
    600: '#379e45',
    700: '#247842',
    800: '#145221',
    900: '#0f3d19',
  },

  yellow: {
    100: '#fffde6',
    200: '#fff9ca',
    300: '#ffe885',
    400: '#fad728',
    500: '#edbf00',
    600: '#c79800',
    700: '#a17600',
    800: '#7a5600',
    900: '#543800',
  },

  orange: {
    100: '#fff0e6',
    200: '#ffdfca',
    300: '#ffc299',
    400: '#ffa15a',
    500: '#fc7e22',
    600: '#d65d11',
    700: '#b04105',
    800: '#8a2c00',
    900: '#631c00',
  },

  red: {
    100: '#ffebe9',
    200: '#ffd1cf',
    300: '#ffabab',
    400: '#ff8380',
    500: '#f96464',
    600: '#d94a4e',
    700: '#b3343c',
    800: '#8c222c',
    900: '#661722',
  },

  pink: {
    100: '#f7dfec',
    200: '#ffcfe5',
    300: '#ffaed5',
    400: '#f980ba',
    500: '#ed64a5',
    600: '#c74a88',
    700: '#a1336e',
    800: '#7a2154',
    900: '#54163b',
  },

  tendershoots: {
    100: '#fbffe5',
    200: '#f4fec3',
    300: '#e4f689',
    400: '#cdee2b',
    500: '#b2d600',
    600: '#99b800',
    700: '#7f9900',
    800: '#667a00',
    900: '#4c5c00',
  },

  purple: {
    100: '#f2f0ff',
    200: '#d9d2ff',
    300: '#c7b8ff',
    400: '#958dff',
    500: '#7c66ff',
    600: '#5c4cd9',
    700: '#4036b3',
    800: '#28238c',
    900: '#1a1866',
    DEFAULT: '#7c66ff',
  },
}

export function createThemes(opts: CreateThemeOpts) {
  const filteredBuiltinThemes = opts.theme.filter(
    (theme): theme is 'qd' | 'qh' | 'qdm' | 'mihua-light' | 'mihua-dark' =>
      typeof theme === 'string',
  )
  const filteredThemeConfigs = opts.theme.filter(
    (theme): theme is ThemeConfig => typeof theme === 'object',
  )

  // 为了兼容现有项目中的变量名，后续也许不需要这个写到全局的 CSS 里面
  const basePlatte = Object.fromEntries(
    Object.entries(base).flatMap(([name, colors]) => {
      return Object.entries(colors).map(([key, value]) => {
        if (key === 'DEFAULT') {
          return [name, value]
        }
        return [`${name}-${+key / 100}`, value]
      })
    }),
  )

  const themePlatte: Record<
    string,
    {
      colors: Set<string>
      vars: Record<string, string>
    }
  > = {}

  themes.forEach((theme) => {
    if (theme.mode.name === '千岛') {
      theme.mode.name = 'qd'
    }
    if (theme.mode.name === '千岛暗黑') {
      theme.mode.name = 'qd-dark'
    }
  })

  mihuaThemes.forEach((theme) => {
    if (theme.mode.name === '米花') {
      theme.mode.name = 'mihua-light'
    }
    if (theme.mode.name === '米花暗黑') {
      theme.mode.name = 'mihua-dark'
      // TODO: 先强制把 secondary 给 default
      // TODO: 后面设计弄好了要把这里删掉
      theme.color.forEach((c) => {
        if (c.name.startsWith('default/')) {
          const candidate = theme.color.find(
            (candidate) =>
              candidate.name === c.name.replace('default', 'secondary'),
          )
          if (candidate) {
            c.color = candidate.color
            c.rootAlias = candidate.rootAlias
            c.var = candidate.var
          }
        }
      })
    }
  })

  // 小程序里极致优化包体积使用
  const alias: Record<string, string> = {}

  function addAlias(name: string) {
    if (alias[name]) {
      return
    }

    alias[name] = nextVarName()
  }

  function hasAlias(name: string) {
    return !!alias[name]
  }

  function getAlias(name: string) {
    return alias[name]
  }

  ;[...themes, ...mihuaThemes].forEach((theme) => {
    if (!filteredBuiltinThemes.find((t) => t === theme.mode.name)) {
      return
    }

    themePlatte[theme.mode.name] = {
      colors: new Set(),
      vars: {},
    }
    theme.color.forEach((color) => {
      const name = kebabCase(color.name.replace(/\//g, '-'))

      const prefix = color.name.split('/')[0]
      if (!['text', 'bg', 'mask', 'icon', 'border'].includes(prefix)) {
        addAlias(name)
        themePlatte[theme.mode.name].colors.add(prefix)
      }

      // 先不支持组件层的变量
      if (name.includes('-bt-')) {
        return
      }

      let val = ''
      if (color.var.startsWith('Main')) {
        // val = color.color
        // const match = color.var.match(/^Main\/(.*)_(\d+)$/)
        // if (match) {
        //   val = `var(--du-${match[1]}-${+match[2]})`
        // }
        themePlatte[theme.mode.name].vars[name] = color.color
      } else if (color.var.startsWith('Semantics')) {
        // const match = color.var.match(/^Semantics\/(.*)_(\d+)$/)
        // if (match) {
        //   val = `var(--du-${match[1]}-${+match[2]})`
        // }
        themePlatte[theme.mode.name].vars[name] = color.color
      } else if (color.var) {
        // TODO: 暂时不采用引用模式，但可能留坑
        // 下面是原来的代码
        // themePlatte[theme.mode.name].vars[name] = `${kebabCase(
        //   color.var.replace(/\//g, '-'),
        // )}`

        themePlatte[theme.mode.name].vars[name] = color.color
      } else {
        themePlatte[theme.mode.name].vars[name] = color.color
      }
      if (name.endsWith('solid-bg')) {
        themePlatte[theme.mode.name].vars[name + '-channel'] = chroma(
          color.color,
        )
          .rgb()
          .join(',')
      }
    })
  })

  // TODO: 和 builtin 要分开
  ;[...filteredThemeConfigs, ...builtinTheme].forEach(({ name, colors }) => {
    if (!themePlatte[name]) {
      themePlatte[name] = {
        vars: {},
        colors: new Set(),
      }
    }

    Object.entries(colors).forEach(([key, value]) => {
      themePlatte[name].colors.add(key)
      Object.entries(value).forEach(([varName, varValue]) => {
        const fullVarName = `${key}-${varName}`
        addAlias(fullVarName)
        themePlatte[name].vars[fullVarName] = `${varValue}`
        if (varName === 'solid-bg') {
          // TODO: 暂时先不考虑变量引用
          themePlatte[name].vars[`${fullVarName}-channel`] = chroma(varValue)
            .rgb()
            .join(',')
        }
      })
    })
  })

  function generateCss() {
    const cssVarsByTheme: {
      name: string
      isDefault: boolean
      vars: Record<string, string>
    }[] = []

    const themeNames = Object.keys(themePlatte)
    const defaultThemeConfig = themePlatte[opts.defaultTheme]

    themeNames.forEach((themeName) => {
      const themeConfig = themePlatte[themeName]
      const vars: Record<string, string> = {}
      const colorSet = new Set<string>()
      const themeAlias: Record<string, string> = {}

      Object.entries(themeConfig.vars).forEach(([key, value]) => {
        const prefix = key.split('-')[0]
        if (!['text', 'bg', 'mask', 'icon', 'border'].includes(prefix)) {
          colorSet.add(prefix)
        }

        if (
          themeName !== opts.defaultTheme &&
          defaultThemeConfig.vars[key] === value
        ) {
          return
        }

        // TODO: 暂时不采用引用模式
        // 一个引用
        // if (themeConfig.vars[value]) {
        //   vars[`--du-${key}`] = `var(--du-${value})`
        // } else {
        //   vars[`--du-${key}`] = value
        // }

        vars[`--du-${key}`] = value
      })

      Object.entries(themeConfig.vars).forEach(([key, value]) => {
        if (alias[key] && vars[`--du-${key}`]) {
          themeAlias[alias[key]] = key
        }
      })

      Object.entries(themeAlias).forEach(([key, value]) => {
        // TODO: 暂时不采用引用模式
        // 一个引用
        // vars[`--dva-${key}`] = `var(--du-${value})`
        vars[`--dva-${key}`] = vars[`--du-${value}`]
      })

      cssVarsByTheme.push({
        name: themeName,
        isDefault: themeName === opts.defaultTheme,
        vars,
      })
    })

    return cssVarsByTheme
      .map((theme) => {
        // TODO: .g-theme-xxx 是为了兼容原来应用中的类名，后续会去掉
        const selector = theme.isDefault
          ? `:root,page,.du-theme-${theme.name},.g-theme-${theme.name},.du-theme-basic,.g-theme-basic`
          : `.du-theme-${theme.name},.g-theme-${theme.name}`
        return `${selector} {\n${Object.entries(theme.vars)
          .map(([key, value]) => `${key}:${value};`)
          .join('\n')}\n}`
      })
      .join('\n')
  }

  return {
    basePlatte,
    themePlatte,
    generateCss,
    addAlias,
    hasAlias,
    getAlias,
  }
}
