<template>
  <div class="du-tooltip">
    <slot />
    <div v-if="title" :class="className" :style="style">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, normalizeClass, normalizeStyle } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    extClass: string | string[] | Record<string, boolean>
    extStyle:
      | string
      | {
          [x: string]: string | number
        }
  }>(),
  {
    title: '',
    extClass: '',
    extStyle: '',
  },
)

const className = computed(() => {
  return normalizeClass(['du-tooltip__popover', props.extClass])
})

const style = computed(() => {
  return normalizeStyle(props.extStyle)
})
</script>
