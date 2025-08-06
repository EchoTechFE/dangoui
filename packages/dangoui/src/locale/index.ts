import { inject, InjectionKey, provide, ref } from 'vue'
import type { Ref } from 'vue'
import zhCN from './lang/zh_CN'

export type LocaleMessages = typeof zhCN

export type LocaleName = 'zh_CN' | 'en_US'

export const LocaleKey = Symbol('DangoUILocale') as InjectionKey<{
  messages: Ref<LocaleMessages>
  name: Ref<LocaleName>
}>

/**
 * 获取或设置当前语言包
 * @returns 返回当前语言包和设置语言包的方法
 */
export function useLocale() {
  const locale = inject(LocaleKey, {
    messages: ref(zhCN),
    name: ref<LocaleName>('zh_CN')
  })

  /**
   * 设置新的语言包
   * @param messages 新的语言包
   */
  /**
   * 设置新的语言包
   * @param name 语言名称
   * @param messages 新的语言包
   */
  function setLocale(name: LocaleName, messages: LocaleMessages) {
    locale.name.value = name
    locale.messages.value = messages
  }

  /**
   * 创建指定组件的翻译函数
   * @param component 组件名称
   * @returns 返回一个获取指定 key 文本的翻译函数
   */
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

/**
 * 提供语言包给子组件使用
 * @param messages 初始语言包，默认使用中文
 */
export function provideLocale(name: LocaleName = 'zh_CN', messages: LocaleMessages = zhCN) {
  provide(LocaleKey, {
    messages: ref(messages),
    name: ref(name)
  })
}
