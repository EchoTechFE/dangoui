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
import { currentApp, isDarkMode } from '~/composables/dumpling'

watch(isHydrated, () => {
  window.addEventListener('message', (message: any) => {
    if (message.data.type === 'theme') {
      const theme: string = message.data.message
      const hasDark = theme.endsWith('-dark')
      isDarkMode.value = hasDark
      currentApp.value = hasDark ? theme.replace(/-dark$/, '') : theme
    }
  })
})

onMounted(() => {
  import('../libs/touch-emulator').then(({ default: TouchEmulator }) => {
    TouchEmulator()
  })
})
</script>
