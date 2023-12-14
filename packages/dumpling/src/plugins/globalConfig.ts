import type { InjectionKey, App, Ref } from 'vue'
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
}

export default {
  install(app: App, config: GlobalConfig) {
    app.provide(GlobalConfigKey, config)
  },
}
