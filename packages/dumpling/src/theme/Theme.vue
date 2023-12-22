<template>
  <div :class="themeName">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { themeInjectionKey } from './helpers'

const props = defineProps<{
  name: string
}>()

const themeName = computed(() => {
  // g-theme-xxx 是为了兼容，后面全部改成 du-theme
  return `du-theme-${props.name} g-theme-${props.name}`
})

provide(themeInjectionKey, {
  name: themeName,
})
</script>
