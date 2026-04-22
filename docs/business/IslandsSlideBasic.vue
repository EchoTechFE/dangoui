<script setup lang="ts">
// IslandsSlideBasic - 横向滑动商品单项
import { DuTag } from 'dangoui'
import SPUBasic from './SPUBasic.vue'

defineProps<{
  images?: string[]
  tag?: string
  tagColor?: string
  name?: string
  wantCount?: string
  size?: 'small' | 'medium' | 'large'
}>()
</script>

<template>
  <!-- figma-node: 14202:601976 -->
  <div class="rounded-[4px] flex flex-col gap-[4px] items-center w-[82px] h-[121px] flex-shrink-0">
    <!-- 图片区域 -->
    <div class="relative">
      <template v-if="size === 'small'">
        <div class="relative w-[74px] h-[99px]">
          <div class="absolute top-0 left-0 rounded-[8px] overflow-hidden">
            <SPUBasic :images="images?.slice(0,1)" size="large" />
          </div>
          <div class="absolute top-[8px] left-[6px] rounded-[8px] overflow-hidden">
            <SPUBasic :images="images?.slice(1,2)" size="medium" />
          </div>
          <div class="absolute top-[16px] left-[11px] rounded-[8px] overflow-hidden">
            <SPUBasic :images="images?.slice(2,3)" size="small" />
          </div>
        </div>
      </template>
      <template v-else>
        <SPUBasic :images="images" size="large" />
      </template>
      <DuTag v-if="tag" :color="tagColor || 'danger'" size="small" round class="absolute right-1 top-1">
        {{ tag }}
      </DuTag>
    </div>
    <span v-if="name" class="text-black text-[12px] font-[400] leading-[18px] text-center">{{ name }}</span>
  </div>
</template>
