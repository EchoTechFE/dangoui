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
  return `du-theme-basic du-theme-${props.name} g-theme-${props.name}`
})

provide(themeInjectionKey, {
  name: themeName,
})
</script>
