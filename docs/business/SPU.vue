<script setup lang="ts">
// SPU - 商品卡片组件
import { DuTag, DuImage } from 'dangoui'
import SPUBasic from './SPUBasic.vue'

defineProps<{
  image?: string
  images?: string[]
  tag?: string
  tagColor?: string
  name?: string
  wantCount?: string
  useStack?: boolean
}>()
</script>

<template>
  <!-- figma-node: 17640:150568 -->
  <div class="rounded-[4px] flex flex-col gap-[4px] items-center w-[74px] h-[134px] flex-shrink-0">
    <div class="relative">
      <div v-if="useStack" class="rounded-[8px] overflow-hidden">
        <SPUBasic :images="images" size="large" />
      </div>
      <div v-else class="rounded-[8px] overflow-hidden">
        <DuImage v-if="image" :src="image" :width="74" :height="134" radius="8" mode="aspectFill" />
        <div v-else class="w-[74px] h-[134px] rounded-[8px] bg-hex-cccccc" />
      </div>
      <DuTag v-if="tag" :color="tagColor || 'danger'" size="small" round class="absolute right-1 top-1">
        {{ tag }}
      </DuTag>
    </div>
    <span v-if="name" class="text-[#2b263b] text-[12px] font-[400] leading-[18px] text-center">{{ name }}</span>
    <span v-if="wantCount" class="text-[rgba(0,0,0,0.4)] text-[10px] font-[400] leading-[11px] text-center">{{ wantCount }} 想要</span>
    <slot />
  </div>
</template>
