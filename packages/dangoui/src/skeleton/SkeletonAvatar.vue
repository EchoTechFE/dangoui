<template>
  <DuSkeletonAnimate :ext-class="classes" :ext-style="style" />
</template>

<script setup lang="ts">
import { computed, normalizeStyle, normalizeClass } from 'vue'
import { useSize } from '../composables/useSize'
import DuSkeletonAnimate from './SkeletonAnimate.vue'

const props = withDefaults(
  defineProps<{
    extClass: string | string[] | Record<string, boolean>
    extStyle: string | { [x: string]: string | number }
    size: number | string
  }>(),
  {
    extClass: '',
    extStyle: () => ({}),
    size: 56,
  }
)

const normalizedSize = useSize(() => props.size)

const classes = computed(() => {
  return normalizeClass(['du-skeleton-avatar', props.extClass])
})

const style = computed(() => {
  return normalizeStyle([
    props.extStyle,
    {
      width: normalizedSize.value,
      height: normalizedSize.value,
    },
  ])
})
</script>
