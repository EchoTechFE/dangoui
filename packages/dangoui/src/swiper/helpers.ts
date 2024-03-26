import type { InjectionKey, Ref } from 'vue'

export type SwiperConfig = {
  width: Ref<number>
  height: Ref<number>
  add: (n: number) => void
}

export const swiperInjectionKey = Symbol() as InjectionKey<SwiperConfig>
