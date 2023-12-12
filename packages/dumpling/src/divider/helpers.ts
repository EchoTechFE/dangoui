import { Ref, InjectionKey } from 'vue'

export const dividerInjectionKey = Symbol('divider') as InjectionKey<{
  defaultType: 'horizontal' | 'vertical'
  length?: Ref<number | string>
}>
