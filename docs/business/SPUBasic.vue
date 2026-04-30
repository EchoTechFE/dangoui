<script setup lang="ts">
// SPUBasic - 商品图片叠层组件
import { DuImage } from 'dangoui'

defineProps<{
  images?: string[]  // 图片数组
  size?: 'small' | 'medium' | 'large'
}>()
</script>

<template>
  <!-- figma-node: 17640:150076 -->
  <div class="relative" :class="{
    'w-[48px] h-[64px]': size === 'small',
    'w-[63px] h-[84px]': size === 'medium',
    'w-[74px] h-[99px]': size === 'large' || !size
  }">
    <div v-for="(img, index) in (images || ['', '', '']).slice(0, 3)" :key="index"
      class="absolute rounded-[4px] overflow-hidden"
      :class="{
        'w-[48px] h-[64px]': size === 'small',
        'w-[63px] h-[84px]': size === 'medium',
        'w-[74px] h-[99px]': size === 'large' || !size
      }"
      :style="{
        top: size === 'small' ? `${index * 8}px` : '0',
        left: size === 'small' ? `${index * 5}px` : '0',
        zIndex: index
      }"
    >
      <DuImage v-if="img" :src="img" :width="size === 'small' ? 48 : size === 'medium' ? 63 : 74" :height="size === 'small' ? 64 : size === 'medium' ? 84 : 99" radius="4" mode="aspectFill" />
      <div v-else class="w-full h-full bg-hex-cccccc" />
    </div>
  </div>
</template>
