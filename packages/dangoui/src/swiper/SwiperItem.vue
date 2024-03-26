<template>
  <div
    class="du-swiper__item"
    :style="{ width: width + 'px', height: height + 'px', overflow: 'hidden' }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
export default {
  options: {
    virtualHost: true,
  },
}
</script>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted } from 'vue'
import { swiperInjectionKey } from './helpers'

const { width, height, add } = inject(swiperInjectionKey)!

onMounted(() => {
  add(1)
})

onBeforeUnmount(() => {
  add(-1)
})
</script>
