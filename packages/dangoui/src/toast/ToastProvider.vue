<template>
  <slot />
  <DuRootPortal v-if="currentMessage" :disabled="false" root="app">
    <div class="du-toast__mask" v-if="currentMessage.mask" />
    <div :class="['du-toast__message', isOpen && 'du-toast__message--open']">
      {{ currentMessage.message }}
    </div>
  </DuRootPortal>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import DuRootPortal from '../root-portal/RootPortal.vue'
import { ToastMessage, toastInjectionKey } from './helpers'

const currentMessage = ref<ToastMessage | null>(null)

const isOpen = ref(false)

let timer: any = null
let uid = 0

function show(opts: ToastMessage) {
  clearTimeout(timer)

  uid++
  const currentUid = uid

  currentMessage.value = opts

  setTimeout(() => {
    if (currentUid !== uid) return

    isOpen.value = true
  }, 100)

  timer = setTimeout(() => {
    if (currentUid !== uid) {
      return
    }

    isOpen.value = false
    setTimeout(() => {
      if (currentUid !== uid) {
        return
      }

      currentMessage.value = null
    }, 500)
  }, 2000)
}

provide(toastInjectionKey, {
  show,
})
</script>
