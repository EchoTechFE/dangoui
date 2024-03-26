<template>
  <div v-if="isHydrated">
    <DuTheme :name="globalTheme">
      <DuToastProvider>
        <slot />
      </DuToastProvider>
    </DuTheme>
  </div>
  <div
    v-else
    class="h-screen flex items-center justify-center text-16px text-gray-600"
  >
    加载中...
  </div>
</template>

<script setup lang="ts">
import { DuTheme, DuToastProvider } from 'dangoui'

watch(isHydrated, () => {
  window.addEventListener('message', (message: any) => {
    if (message.data.type === 'theme') {
      globalTheme.value = message.data.message
    }
  })
})

onMounted(() => {
  import('../libs/touch-emulator').then(({ default: TouchEmulator }) => {
    TouchEmulator()
  })
})
</script>
