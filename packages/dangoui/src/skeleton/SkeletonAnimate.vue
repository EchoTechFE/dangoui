<template>
  <div :class="classes" :style="style" />
</template>

<script setup lang="ts">
import { computed, normalizeStyle, normalizeClass } from 'vue'

const props = withDefaults(
  defineProps<{
    extClass: string | string[] | Record<string, boolean>
    extStyle: string | { [x: string]: string | number }
  }>(),
  {
    extClass: '',
    extStyle: () => ({}),
  }
)

const classes = computed(() => {
  return normalizeClass(['du-skeleton-animate', props.extClass])
})

const style = computed(() => {
  return normalizeStyle([props.extStyle])
})
</script>