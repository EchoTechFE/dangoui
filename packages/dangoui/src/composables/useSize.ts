import { MaybeRefOrGetter, computed, inject, unref } from 'vue'
import { GlobalConfigKey } from '../plugins/globalConfig'

// support < 3.3
function toValue<T>(v: MaybeRefOrGetter<T>): T {
  if (v instanceof Function) {
    return v()
  }
  return unref(v)
}

export function useSize(size: MaybeRefOrGetter<number | string | undefined>) {
  const globalConfig = inject(GlobalConfigKey,null)

  return computed(() => {
    const s = toValue(size)
    if (globalConfig?.unitTransform) {
      // 如果是小程序
      if (typeof s === 'number' && globalConfig.unitTransform.number) {
        return (s * 750) / globalConfig.unitTransform.designWidth + 'rpx'
      }
    }

    if (typeof s === 'number') {
      return s + 'px'
    }

    return s
  })
}
