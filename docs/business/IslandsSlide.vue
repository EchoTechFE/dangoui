<script setup lang="ts">
// IslandsSlide - 横向滑动容器组件
// 支持 IslandsSlideBasic 和 SPU 两种子组件混排
</script>

<template>
  <!-- figma-node: 14202:601976 -->
  <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
    <slot />
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
