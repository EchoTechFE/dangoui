<script setup lang="ts">
// IslandsGridBasic - 顶部类目网格单项组件
defineProps<{
  name?: string        // 类目名称
  image?: string       // 图片地址
  iconType?: 'emoji' | 'spu' | 'image'  // 图标类型
}>()
</script>

<template>
  <!-- figma-node: 14202:603086 -->
  <div class="bg-bg rounded-2 flex gap-1 items-center py-1 pl-1 pr-2 h-10">
    <!-- emoji 图标 -->
    <div v-if="iconType === 'emoji'" class="flex justify-end items-center w-7 h-8">
      <div class="bg-[#2b263b] w-4 h-4 rounded-1" />
    </div>
    <!-- SPU 图标 -->
    <div v-else-if="iconType === 'spu'" class="flex justify-end items-center w-6 h-8">
      <div class="w-6 h-8 rounded-1 bg-hex-cccccc" />
    </div>
    <!-- 图片图标 -->
    <div v-else-if="iconType === 'image'" class="rounded-1 w-8 h-8 bg-hex-cccccc" />

    <!-- 名称 -->
    <span class="text-h5 fw-1000 c-text-1">{{ name }}</span>

    <!-- 箭头 -->
    <div class="bg-[#918b9f] w-2 h-2 rounded-full" />
  </div>
</template>
