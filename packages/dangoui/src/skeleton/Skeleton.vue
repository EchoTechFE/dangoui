<template>
  <div v-if="loading" :class="classes" :style="style">
    <div class="du-skeleton__content">
      <slot name="template" />
    </div>
  </div>
  <slot v-else></slot>
</template>

<script setup lang="ts">
import { computed, normalizeStyle, normalizeClass } from 'vue'

const props = withDefaults(
  defineProps<{
    extClass: string | string[] | Record<string, boolean>
    extStyle:
      | string
      | {
          [x: string]: string | number
        }
    loading: boolean
  }>(),
  {
    extClass: '',
    extStyle: () => ({}),
    loading: true,
  },
)

const classes = normalizeClass(['du-skeleton', props.extClass])
const style = computed(() => {
  const { extStyle } = props
  return normalizeStyle([extStyle])
})
</script>
