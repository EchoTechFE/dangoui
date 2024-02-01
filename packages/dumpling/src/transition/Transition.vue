<template>
  <view
    :style="{
      opacity: innerShow ? '1' : '0',
      transform: `translate(0,${innerShow ? '0' : '10px'})`,
      transition: 'transform 0.25s, opacity 0.25s',
    }"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    name: 'fadeInUp'
    show: boolean
  }>(),
  {
    name: 'fadeInUp',
    show: true,
  },
)

const innerShow = ref(false)

onMounted(() => {
  if (props.show) {
    setTimeout(() => {
      innerShow.value = props.show
    }, 50)
  }
})

watch(
  () => props.show,
  (show) => {
    innerShow.value = show
  },
)
</script>
