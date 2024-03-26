import type { InjectionKey, App } from 'vue'
import { UploadFile } from '../upload/helpers'

export const GlobalConfigKey = Symbol(
  'GlobalConfig',
) as InjectionKey<GlobalConfig>

type GlobalConfig = {
  // TODO: 未完全稳定
  unitTransform?: {
    number?: boolean
    designWidth: number
  }
  upload?: {
    /**
     * 在真正上传之前，返回一些参数，作为上传用的参数
     * @param scene
     * @returns
     */
    beforeUpload?: (f: UploadFile) => UploadFile | Promise<UploadFile>
    /**
     * 完全自定义的上传方法，发生在 beforeUpload 之后，beforeResponse 之前
     * @param f
     * @returns
     */
    customUpload?: (f: UploadFile) => Promise<UploadFile>
    /**
     *
     * @param f
     * @returns
     */
    beforeResponse?: (f: UploadFile) => UploadFile | Promise<UploadFile>
  }
  image?: {
    providers: Array<{
      test: RegExp
      getImage: (
        src: string,
        opts: { modifiers: { width: number; height: number; dpr: number } },
      ) => { url: string }
    }>
  }
  /**
   * 小程序独有
   */
  homePath?: string

  /**
   * 主题配置
   *
   * 该配置仅在 Web 平台生效
   *
   * 在小程序平台，请使用 `vite-plugin-dangoui` 指定主题
   */
  themes?: {
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
  }[]
}

export default {
  install(app: App, config: GlobalConfig) {
    app.provide(GlobalConfigKey, config)

    if (__WEB__) {
      function kebab(str: string) {
        return str
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .replace(/\B([A-Z]+)/g, '-$1')
          .toLowerCase()
      }

      function getComponentClassName(name: string) {
        switch (name) {
          case 'button':
            return 'bt'
          default:
            return name
        }
      }

      const themes = config.themes ?? []

      const styles: Record<string, string[]> = {}

      themes.forEach((theme) => {
        Object.entries(theme.colors).forEach(([color, vars]) => {
          Object.entries(vars).forEach(([name, value]) => {
            if (typeof value === 'string') {
              const selector = `.du-theme-${theme.name}`
              if (!styles[selector]) {
                styles[selector] = []
              }
              styles[selector].push(`--du-${color}-${kebab(name)}: ${value};`)
            } else {
              const selector = `.du-theme-${
                theme.name
              } .du-c-${color}-${getComponentClassName(name)}`
              if (!styles[selector]) {
                styles[selector] = []
              }
              Object.entries(value).forEach(([subname, subvalue]) => {
                styles[selector].push(
                  `--du-${getComponentClassName(name)}-${kebab(
                    subname,
                  )}: ${subvalue};`,
                )
              })
            }
          })
        })
      })

      if (typeof document !== 'undefined') {
        const css = Object.entries(styles)
          .map(([selector, rules]): string => {
            return `${selector} {\n${rules.join('\n')}\n}\n`
          })
          .join('\n')

        const previousStyleElement = document.querySelector(
          'style[data-dangoui-theme]',
        ) as HTMLStyleElement | null

        if (previousStyleElement && previousStyleElement.textContent !== css) {
          previousStyleElement.textContent = css
        } else {
          const styleElement = document.createElement('style')
          styleElement.textContent = css
          styleElement.setAttribute('type', 'text/css')
          styleElement.setAttribute('data-dangoui-theme', '')

          document.head.appendChild(styleElement)
        }
      }
    }
  },
}
