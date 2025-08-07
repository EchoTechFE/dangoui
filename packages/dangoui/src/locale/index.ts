import { inject, InjectionKey, provide, ref } from 'vue'
import type { Ref } from 'vue'
import zhCN from './lang/zh_CN'

export type LocaleMessages = typeof zhCN

export type LocaleName = 'zh_CN'

const localeMessages: Record<LocaleName, LocaleMessages> = {
  'zh_CN': zhCN,
}

export const LocaleKey = Symbol('DangoUILocale') as InjectionKey<{
  messages: Ref<LocaleMessages>
  name: Ref<LocaleName>
}>

export function registerLocale(name: LocaleName, messages: LocaleMessages) {
  localeMessages[name] = messages
}

export function useLocale() {
  const locale = inject(LocaleKey, {
    messages: ref(zhCN),
    name: ref<LocaleName>('zh_CN')
  })

  function setLocale(name: LocaleName) {
    const messages = localeMessages[name]
    if (!messages) {
      console.warn(`[DangoUI] Locale ${name} not found. Please add it using addMessages first.`)
      return
    }
    locale.name.value = name
    locale.messages.value = messages
  }

  function useTranslator<C extends keyof LocaleMessages>(component: C) {
    return function<K extends keyof LocaleMessages[C]>(
      key: K,
      ...args: LocaleMessages[C][K] extends (...args: any[]) => any
        ? Parameters<LocaleMessages[C][K]>
        : []
    ): string {
      const componentMessages = locale.messages.value[component]
      if (typeof componentMessages === 'object' && componentMessages !== null) {
        const value = componentMessages[key]
        if (typeof value === 'function') {
          return (value as Function)(...args)
        }
        return String(value ?? key)
      }
      return String(key)
    }
  }

  return {
    messages: locale.messages,
    currentLocale: locale.name,
    setLocale,
    useTranslator
  }
}

// 初始化，提供语言包的能力支持，在 App.vue 中使用
export function useLocaleProvider(name: LocaleName = 'zh_CN') {
  provide(LocaleKey, {
    messages: ref(localeMessages[name] || zhCN),
    name: ref(name)
  })
}
