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

const route = useRoute()

onMounted(() => {
  globalTheme.value = localStorage.getItem('DANGOUI_THEME') ?? ''
})
</script>
