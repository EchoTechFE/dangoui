<script setup lang="ts">
// IslandsGridBasic - 类目网格单项
import SPUBasic from './SPUBasic.vue'

defineProps<{
  name: string
  iconType?: 'emoji' | 'image' | 'spu'
}>()
</script>

<template>
  <!-- figma-node: 14202:603086 -->
  <div class="bg-[#f7f7f9] rounded-[8px] flex gap-[4px] items-center py-[4px] pl-[4px] pr-[8px] h-[40px]">
    <!-- 图标区域 -->
    <div class="flex gap-[10px] justify-end items-center w-[28px] h-[32px]">
      <!-- emoji 类型 -->
      <div v-if="iconType === 'emoji'" class="bg-[#2b263b] w-[17px] h-[17px] rounded-full" />
      <!-- image 类型 -->
      <div v-else-if="iconType === 'image'" class="rounded-[4px] w-[32px] h-[32px] bg-hex-cccccc" />
      <!-- spu 类型 -->
      <SPUBasic v-else-if="iconType === 'spu'" class="w-[24px] h-[32px]" />
    </div>

    <!-- 名称 -->
    <span class="text-[#2b263b] text-[15px] font-[1000] leading-[14px]">{{ name }}</span>

    <!-- 箭头 -->
    <div class="bg-[#918b9f] w-[7px] h-[7px] rounded-full" />
  </div>
</template>
