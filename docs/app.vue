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
import '@echotechfe/dumpling/style.css'
import '@echotechfe/dumpling/theme.css'
import 'tippy.js/dist/tippy.css'

const route = useRoute()

onMounted(() => {
  globalTheme.value = localStorage.getItem('DUMPLING_THEME') ?? ''
})
</script>
