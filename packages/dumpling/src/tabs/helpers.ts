import type { InjectionKey, Ref } from 'vue'

type TabsConfig = {
  size: Ref<'normal' | 'large'>
  type: Ref<'default' | 'tag' | 'text'>
  value: Ref<string>
  setValue: (name: string, id: string) => void
}

export const TabsInjectionKey = Symbol() as InjectionKey<TabsConfig>

let idx = 1

export function getInstanceId() {
  return idx++
}
