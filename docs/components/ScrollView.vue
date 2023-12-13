<template>
  <div
    class="scroll-view"
    @scroll="getScroll"
    ref="scrollViewRef"
    :style="style"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'

const props = defineProps<{
  scrollX?: boolean
  scrollY?: boolean
  scrollIntoView?: string
  scrollTop?: number
  scrollLeft?: number
}>()

const scrollTop = ref(0)

const scrollViewRef = ref<HTMLDivElement>()

const emit = defineEmits<{
  (e: 'scrolltolower'): void
  (e: 'scrolltoupper'): void
}>()

const style = computed(() => {
  const s: CSSProperties = {
    overflowX: 'hidden',
    overflowY: 'hidden',
  }

  if (props.scrollX) {
    s.overflowX = 'scroll'
  }
  if (props.scrollY) {
    s.overflowY = 'scroll'
  }

  return s
})

watch(
  () => props.scrollIntoView,
  (id) => {
    if (id) {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  },
)

watch(
  () => props.scrollLeft,
  () => {
    scrollViewRef.value?.scrollTo({
      left: props.scrollLeft,
      behavior: 'smooth',
    })
  },
)

function getScroll(e: any) {
  let wScrollY = e.target.scrollTop // 当前滚动条位置
  scrollTop.value = wScrollY
  let wInnerH = e.target.clientHeight // 设备窗口的高度（不会变）
  let bScrollH = e.target.scrollHeight // 元素总高度
  if (wScrollY + wInnerH + 10 >= bScrollH) {
    emit('scrolltolower')
  } else if (wScrollY < 10) {
    emit('scrolltoupper')
  }
}
</script>
