import { inject } from 'vue'
import { ToastMessage, toastInjectionKey } from '../toast/helpers'

export function useToast() {
  const toast = inject(toastInjectionKey)

  return {
    show: (opts: ToastMessage) => {
      if (__WEB__) {
        toast?.show(opts)
      } else {
        uni.showToast({
          icon: 'none',
          title: opts.message,
          mask: opts.mask,
        })
      }
    },
  }
}
