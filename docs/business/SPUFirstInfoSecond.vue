<script setup lang="ts">
// SPUFirstInfoSecond - SPU 首行信息+次行信息组件
// 典型结构：价格 + 想要/活动数量
import PriceEcho from './PriceEcho.vue'

defineProps<{
  price: string | number   // 价格
  wantCount?: string       // 想要数量（如 "224万"）
  activityCount?: string   // 活动数量（如 "8.6 场活动"）
}>()
</script>

<template>
  <!-- figma-node: 83073:54770 -->
  <div class="flex gap-1 justify-between items-center">
    <!-- 价格 -->
    <PriceEcho :price="price" size="small" />

    <!-- 右侧信息：想要数量或活动数量 -->
    <div class="flex gap-1 items-center">
      <div class="bg-[#918b9f] w-2 h-2 rounded-1" />
      <span class="c-text-3 text-b5">{{ wantCount || activityCount }}</span>
    </div>
  </div>
</template>
