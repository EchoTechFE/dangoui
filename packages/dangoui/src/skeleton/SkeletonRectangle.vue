<template>
  <div :class="classes" :style="style" />
</template>

<script setup lang="ts">
import { computed, normalizeStyle, normalizeClass } from 'vue'
import { useSize } from '../composables/useSize'

const props = withDefaults(
  defineProps<{
    extClass: string | string[] | Record<string, boolean>
    extStyle: string | { [x: string]: string | number }
    aspectRatio: number
    width: number | string
  }>(),
  {
    extClass: '',
    extStyle: () => ({}),
    aspectRatio: 1,
    width: 120,
  },
)

const classes = computed(() => {
  return normalizeClass(['du-skeleton-rectangle', 'du-skeleton__animate', props.extClass])
})

const normalizedWidth = useSize(() => props.width)

const style = computed(() => {
  return normalizeStyle([
    props.extStyle,
    {
      width: normalizedWidth.value,
      aspectRatio: props.aspectRatio,
    },
  ])
})
</script>
