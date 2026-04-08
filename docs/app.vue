<template>
  <NuxtLayout :name="route.path.startsWith('/demos') ? 'demo' : 'doc'">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import '@unocss/reset/tailwind-compat.css'
import 'overlayscrollbars/overlayscrollbars.css'
import '@/assets/index.css'
import '@/assets/github-markdown-light.css'
import 'dangoui/style.css'
import 'dangoui/theme.css'
import 'tippy.js/dist/tippy.css'
import { globalTheme, currentApp, isDarkMode } from '~/composables/dumpling'

const route = useRoute()

onMounted(() => {
  const stored = localStorage.getItem('DANGOUI_THEME') || 'qd'
  if (stored.endsWith('-dark')) {
    currentApp.value = stored.slice(0, -5)
    isDarkMode.value = true
  } else {
    currentApp.value = stored
    isDarkMode.value = false
  }
})
</script>
