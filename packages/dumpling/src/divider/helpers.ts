import { InjectionKey } from 'vue'

export const dividerInjectionKey = Symbol('divider') as InjectionKey<{
  defaultType: 'horizontal' | 'vertical'
}>
