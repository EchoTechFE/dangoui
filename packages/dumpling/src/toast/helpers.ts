import { InjectionKey } from 'vue'

export type ToastMessage = {
  message: string
  mask?: boolean
}

export const toastInjectionKey = Symbol() as InjectionKey<{
  show: (opts: ToastMessage) => void
}>
