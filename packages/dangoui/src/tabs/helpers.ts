import type { InjectionKey, Ref } from 'vue'

export type TabConfigOpt = {
  rect?: {
    left: number
    right: number
    top: number
    bottom: number
    width: number
    height: number
  }
}

export type TabsConfig = {
  size: Ref<'normal' | 'large'>
  type: Ref<'default' | 'tag' | 'text'>
  value: Ref<string>
  color: Ref<string>
  indicator: Ref<string | undefined>
  setValue: (name: string, id: string) => void
  updateLayout: (name: string, id: string, opts?: TabConfigOpt) => void
}

export const TabsInjectionKey = Symbol() as InjectionKey<TabsConfig>

let idx = 1

export function getInstanceId() {
  return idx++
}
