<template>
  <div
    class="scroll-view"
    @scroll="getScroll"
    ref="scrollViewRef"
    :style="`${
      scrollX === true ? 'overflow-x:scroll; overflow-y:hidden' : ''
    };${scrollY === true ? 'overflow-x:hidden; overflow-y:scroll' : ''};`"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
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
