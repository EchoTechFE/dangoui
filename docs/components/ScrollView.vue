<template>
  <div
    @scroll="getScroll"
    :style="`${
      scrollX === 'true' || scrollX === true
        ? 'overflow-x:scroll; overflow-y:hidden'
        : ''
    };${
      scrollY === 'true' || scrollY === true
        ? 'overflow-x:hidden; overflow-y:scroll'
        : ''
    };`"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  scrollX?: string | boolean
  scrollY?: string | boolean
  scrollIntoView?: string
}>()

const scrollTop = ref(0)

const emit = defineEmits<{
  (e: 'scrolltolower'): void
  (e: 'scrolltoupper'): void
}>()

onMounted(() => {
  if (props.scrollIntoView) {
    const el = document.getElementById(props.scrollIntoView)
    if (el) {
      el.scrollIntoView()
    }
  }
})

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
