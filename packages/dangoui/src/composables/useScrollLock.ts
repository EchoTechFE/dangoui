import { MaybeRefOrGetter, watch, unref } from "vue";

function toValue<T>(v: MaybeRefOrGetter<T>): T {
  if (v instanceof Function) {
    return v()
  }
  return unref(v)
}

const DU_OVERFLOW_HIDDEN = 'du-overflow-hidden'

let totalLockCount = 0

export function useBodyScrollLock(locked: MaybeRefOrGetter<boolean>) {
  function lock() {
    if (totalLockCount === 0) {
      document.body.classList.add(DU_OVERFLOW_HIDDEN)
    }
    totalLockCount++
  }

  function unlock() {
    totalLockCount--
    if (totalLockCount === 0) {
      document.body.classList.remove(DU_OVERFLOW_HIDDEN)
    }
  }

  watch(() => toValue(locked), (locked) => {
    if (locked) {
      lock()
    } else {
      unlock()
    }
  })
}
