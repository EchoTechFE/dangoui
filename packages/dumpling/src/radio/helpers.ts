import type { Ref, InjectionKey } from 'vue'

type RadioGroupConfig = {
  inline: boolean
  shape: 'normal' | 'button'
  custom: boolean
  cell: boolean
  valueKey?: string
}

export const groupConfigInjectionKey = Symbol(
  'groupConfigInjectionKey',
) as InjectionKey<Ref<RadioGroupConfig>>

export const groupValueInjectionKey = Symbol() as InjectionKey<
  Ref<any | undefined>
>

export const setGroupValueInjectionKey = Symbol() as InjectionKey<
  (value: any) => void
>
