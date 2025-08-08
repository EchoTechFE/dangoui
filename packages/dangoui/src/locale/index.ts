import { inject, InjectionKey, provide, ref } from 'vue'
import type { Ref } from 'vue'
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
    weekdays: string[]
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

const localeMessages: Record<string, Locale> = {
  'zh_CN': zhCN,
}

export const LocaleKey = Symbol('DangoUILocale') as InjectionKey<{
  messages: Ref<Locale>
  name: Ref<string>
}>

export function registerLocale(name: string, messages: Locale) {
  localeMessages[name] = messages
}

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
  const locale = inject(LocaleKey, {
    messages: ref(zhCN),
    name: ref<string>('zh_CN')
  })

  function setLocale(name: string) {
    const messages = localeMessages[name]
    if (!messages) {
      console.warn(`[DangoUI] Locale ${name} not found. Please add it using addMessages first.`)
      return
    }
    locale.name.value = name
    locale.messages.value = messages
  }

  function useTranslator(name: string) {
    return (path: string, ...args: unknown[]) => {
      const messages = locale.messages.value
      const message = get(messages, `${name}.${path}`) || get(messages, path)
      return isFunction(message) ? message(...args) : String(message ?? path)
    }
  }

  return {
    messages: locale.messages,
    currentLocale: locale.name,
    setLocale,
    useTranslator
  }
}

export function useLocaleProvider(name: string = 'zh_CN') {
  provide(LocaleKey, {
    messages: ref(localeMessages[name] || zhCN),
    name: ref(name)
  })
}
