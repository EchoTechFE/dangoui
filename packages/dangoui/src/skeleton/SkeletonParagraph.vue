<template>
  <DuSkeletonAnimate :class="classes" :style="style" />
</template>

<script setup lang="ts">
import { computed, normalizeStyle, normalizeClass } from 'vue'
import { useSize } from '../composables/useSize'
import DuSkeletonAnimate from './SkeletonAnimate.vue'

const props = withDefaults(
  defineProps<{
    extClass: string | string[] | Record<string, boolean>
    extStyle: string | { [x: string]: string | number }
    rowWidth: string
    rowHeight: number | string
    gap: number | string
  }>(),
  {
    extClass: '',
    extStyle: () => ({}),
    rowWidth: '100%',
    rowHeight: 16,
    gap: 8,
  }
)

const classes = computed(() => {
  return normalizeClass(['du-skeleton-paragraph', props.extClass])
})

const normalizedRowHeight = useSize(() => props.rowHeight)
const normalizedGap = useSize(() => props.gap)

const style = computed(() => {
  const baseStyle: Record<string, string> = {}
  if (normalizedRowHeight.value) {
    baseStyle['--du-skeleton-paragraph-height'] = normalizedRowHeight.value
  }
  if (normalizedGap.value) {
    baseStyle['--du-skeleton-paragraph-gap'] = normalizedGap.value
  }
  return normalizeStyle([props.extStyle, baseStyle, {
    width: props.rowWidth,
  }])
})
</script>
