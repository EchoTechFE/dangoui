import { globalConfig } from 'dangoui'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

export default defineNuxtPlugin((nuxtApp) => {
  dayjs.locale('zh-cn')

  nuxtApp.vueApp.use(globalConfig, {
    upload: {
      beforeUpload(file) {
        file.action =
          'https://run.mocky.io/v3/de7ed31f-93f1-4143-b25e-c9249cd77a5c'
        file.name = 'file'
        return file
      },
      beforeResponse(file) {
        if (file.statusCode === 200) {
          const json = JSON.parse(file.responseText ?? '{}')
          file.url = json.url
          file.thumbUrl = json.url
          file.status = 'done'
        } else {
          file.status = 'error'
        }
        return file
      },
    },
    image: {
      providers: [
        {
          test: /^https:\/\/cdn\.qiandaoapp\.com/,
          getImage(src, options) {
            if (options.modifiers.width < 300) {
              return {
                url: src + '!lfit_w240_jpg',
              }
            }

            return {
              url: src,
            }
          },
        },
      ],
    },
    tabs: {
      indicator: {
        qd: 'https://cdn.qiandaoapp.com/interior/images/2ec7a1feb8c27ce9ed0e948ce2676a0a.svg',
      },
    },
    themes: [
      {
        name: 'qd',
        colors: {
          gradient: {
            button: {
              solidBg: 'linear-gradient(151deg, #2B1AC0 0%, #7247DC 100%)',
              solidColor: '#fff',
            },
          },
        },
      },
      {
        name: 'linjie',
        colors: {
          primary: {
            button: {
              solidBg: 'linear-gradient(151deg, #2B1AC0 0%, #7247DC 100%)',
            },
          },
        },
      },
    ],
  })
})
