<script setup lang="ts">
// SPUBasic - 商品卡片基础组件（叠层展示）
import { DuImage } from 'dangoui'

defineProps<{
  images?: string[]   // 商品图片数组（支持 2-3 张叠放）
  count?: number       // 图片数量（默认从 images.length 自动计算）
  size?: 'small' | 'medium' | 'large'  // 尺寸
}>()
</script>

<template>
  <!-- figma-node: 80961:2211381 -->
  <div
    class="relative"
    :class="{
      'w-[48px] h-[64px]': size === 'small',
      'w-[63px] h-[84px]': size === 'medium',
      'w-[74px] h-[99px]': size === 'large' || !size
    }"
  >
    <!-- 底层图片 -->
    <div
      class="absolute top-0 left-0 rounded-2 overflow-hidden"
      :class="{
        'w-[48px] h-[64px]': size === 'small',
        'w-[63px] h-[84px]': size === 'medium',
        'w-[74px] h-[99px]': size === 'large' || !size
      }"
    >
      <DuImage
        v-if="images?.[0]"
        :src="images[0]"
        :width="size === 'small' ? 48 : size === 'medium' ? 63 : 74"
        :height="size === 'small' ? 64 : size === 'medium' ? 84 : 99"
        radius="8"
        mode="aspectFill"
      />
      <div v-else class="w-full h-full rounded-2 bg-hex-cccccc" />
    </div>

    <!-- 叠层效果：第二张 -->
    <div
      v-if="(count === 2 || count === 3) && images?.length >= 2"
      class="absolute top-0 left-0 rounded-2 overflow-hidden"
      :class="{
        'w-[48px] h-[64px]': size === 'small',
        'w-[63px] h-[84px]': size === 'medium',
        'w-[74px] h-[99px]': size === 'large' || !size
      }"
    >
      <DuImage
        :src="images[1]"
        :width="size === 'small' ? 48 : size === 'medium' ? 63 : 74"
        :height="size === 'small' ? 64 : size === 'medium' ? 84 : 99"
        radius="8"
        mode="aspectFill"
      />
    </div>

    <!-- 叠层效果：第三张 -->
    <div
      v-if="count === 3 && images?.length >= 3"
      class="absolute top-0 left-0 rounded-2 overflow-hidden"
      :class="{
        'w-[48px] h-[64px]': size === 'small',
        'w-[63px] h-[84px]': size === 'medium',
        'w-[74px] h-[99px]': size === 'large' || !size
      }"
    >
      <DuImage
        :src="images[2]"
        :width="size === 'small' ? 48 : size === 'medium' ? 63 : 74"
        :height="size === 'small' ? 64 : size === 'medium' ? 84 : 99"
        radius="8"
        mode="aspectFill"
      />
    </div>

    <!-- 边框线 -->
    <div class="border border-black/4 rounded-2 absolute inset-0" />
  </div>
</template>
