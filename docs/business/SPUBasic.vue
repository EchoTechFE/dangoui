<script setup lang="ts">
// SPUBasic - 商品卡片基础组件（叠层展示）
defineProps<{
  image?: string   // 商品图片
  count?: number   // 叠层数量（2-3张叠放）
}>()
</script>

<template>
  <!-- figma-node: 17485:247554 -->
  <div class="relative">
    <!-- 底层图片 -->
    <div
      v-if="image"
      class="rounded-4 bg-hex-cccccc"
      :class="count === 2 ? 'w-63 h-84' : count === 3 ? 'w-74 h-99' : 'w-48 h-64'"
    />

    <!-- 叠层效果：第二张 -->
    <div
      v-if="count === 2 || count === 3"
      class="absolute top-0 left-0 rounded-8 bg-hex-cccccc w-63 h-84"
    />

    <!-- 叠层效果：第三张 -->
    <div
      v-if="count === 3"
      class="absolute top-0 left-0 rounded-8 bg-hex-cccccc w-74 h-99"
    />

    <!-- 边框线 -->
    <div class="border border-black/4 rounded-4 absolute inset-0" />
  </div>
</template>
