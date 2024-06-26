import type { InjectionKey, Ref } from 'vue'

export type CheckboxGroupConfig = {
  shape?: 'round' | 'square' | 'card'
  inline?: boolean
  position?: 'left' | 'right'
  custom?: boolean
  color?: string
}

export const groupConfigInjectionKey = Symbol(
  'groupConfigInjectionKey',
) as InjectionKey<Ref<CheckboxGroupConfig>>

export const groupValueInjectionKey = Symbol() as InjectionKey<
  Ref<Array<string>>
>

export const setGroupValueInjectionKey = Symbol() as InjectionKey<
  (value: Array<string>) => void
>
