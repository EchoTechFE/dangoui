import { computed, reactive, ref } from 'vue'
import zhCN from './lang/zh_CN'

export type Locale = {
  global: {
    close: string
    cancel: string
    confirm: string
    select: string
  }
  Calendar: {
    clear: string
    selectDate: string
    selectDateRange: (maxRange: number) => string
    today: string
    startEnd: string
    start: string
    end: string
    startTime: string
    endTime: string
    hour: string
    minute: string
    selected: string
    toBeSet: string
    startShouldBeforeEnd: string
    missingEndTime: string
    maxDays: (maxRange: number) => string
    selectedDates: (count: number) => string
    weekdays: () => string[]
  }
  FormItem: {
    edited: string
  }
  TagsPanel: {
    fold: string
    expand: string
  }
  Upload: {
    uploading: string
    image: string
    video: string
    maxCount: (maxCount: number) => string
  }
}

type LocaleMessages = Record<string, Locale>

const localeMessages = reactive<LocaleMessages>({
  zh_CN: zhCN,
})

const currentLocale = ref('zh_CN')

const isFunction = (value: any) => typeof value === 'function'
const isObject = (value: any) => typeof value === 'object' && value !== null

const get = (object: any, path: string): any => {
  const keys = path.split('.')
  let result = object

  keys.forEach((key) => {
    result = isObject(result) ? result[key] ?? '' : ''
  })

  return result
}

export function useLocale() {
  const messages = computed(() => localeMessages[currentLocale.value] || zhCN)

  function registerLocale(name: string, messages: Locale) {
    localeMessages[name] = messages
  }

  function useTranslator(name: string) {
    return (path: string, ...args: unknown[]) => {
      const message = get(messages.value, `${name}.${path}`) || get(messages.value, path)
      return isFunction(message) ? message(...args) : String(message ?? path)
    }
  }

  return {
    locale: currentLocale,
    useTranslator,
    registerLocale,
  }
}
