import { MaybeRefOrGetter, computed, inject, unref } from 'vue'
import { GlobalConfigKey } from '../plugins/globalConfig'

// support < 3.3
function toValue<T>(v: MaybeRefOrGetter<T>): T {
  if (v instanceof Function) {
    return v()
  }
  return unref(v)
}

export function useSize(size: MaybeRefOrGetter<number | string>) {
  const globalConfig = inject(GlobalConfigKey)

  return computed(() => {
    const s = toValue(size)
    if (globalConfig?.unitTransform) {
      // 如果是小程序
      if (typeof s === 'number' && globalConfig.unitTransform.number) {
        return (s * 750) / globalConfig.unitTransform.designWidth + 'rpx'
      }
    }

    return s
  })
}
