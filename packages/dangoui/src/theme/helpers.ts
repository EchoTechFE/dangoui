import { InjectionKey, Ref } from 'vue'

export const themeInjectionKey = Symbol('theme') as InjectionKey<{
  name: string | Ref<string>
}>
