<template>
  <div :class="name">
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
  return props.name
})

provide(themeInjectionKey, {
  name: themeName,
})
</script>
