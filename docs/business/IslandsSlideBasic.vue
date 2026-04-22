<script setup lang="ts">
// IslandsSlideBasic - 横向滑动商品单项组件
import { DuTag, DuImage } from 'dangoui'

defineProps<{
  images?: string[]   // 商品图片数组（支持 2-3 张叠放）
  count?: number       // 图片数量（默认从 images.length 自动计算）
  tag?: string         // 标签文字（如 "+36"、"NEW"）
  tagColor?: string    // 标签颜色
  name?: string        // 商品名称
  wantCount?: string   // 想要数量
  size?: 'small' | 'medium' | 'large'  // 尺寸
}>()
</script>

<template>
  <!-- figma-node: 14202:601976 -->
  <div
    class="rounded-1 flex flex-col gap-1 items-center flex-shrink-0"
    :class="{
      'w-[82px] h-[121px]': size === 'small',
      'w-[107px] h-[165px]': size === 'medium' || !size,
      'w-[74px] h-[134px]': size === 'large'
    }"
  >
    <!-- SPU 图片 + 标签 -->
    <div class="relative">
      <!-- 根据 size 决定图片尺寸 -->
      <template v-if="size === 'small'">
        <!-- 74x99 尺寸：3 张叠放 -->
        <div class="relative w-[74px] h-[99px]">
          <div class="absolute top-0 left-0 rounded-2 overflow-hidden">
            <DuImage v-if="images?.[0]" :src="images[0]" :width="74" :height="99" radius="8" mode="aspectFill" />
            <div v-else class="w-[74px] h-[99px] rounded-2 bg-hex-cccccc" />
          </div>
          <div class="absolute top-0 left-0 rounded-2 overflow-hidden">
            <DuImage v-if="images?.[1]" :src="images[1]" :width="63" :height="84" radius="8" mode="aspectFill" />
            <div v-else class="w-[63px] h-[84px] rounded-2 bg-hex-cccccc" />
          </div>
          <div class="absolute top-0 left-0 rounded-2 overflow-hidden">
            <DuImage v-if="images?.[2]" :src="images[2]" :width="48" :height="64" radius="8" mode="aspectFill" />
            <div v-else class="w-[48px] h-[64px] rounded-2 bg-hex-cccccc" />
          </div>
        </div>
      </template>

      <template v-else-if="size === 'large'">
        <!-- 74x134 尺寸 -->
        <div class="rounded-2 overflow-hidden">
          <DuImage v-if="images?.[0]" :src="images[0]" :width="74" :height="134" radius="8" mode="aspectFill" />
          <div v-else class="w-[74px] h-[134px] rounded-2 bg-hex-cccccc" />
        </div>
      </template>

      <template v-else>
        <!-- 默认 107x165 尺寸 -->
        <div class="relative w-[107px] h-[165px]">
          <div class="absolute top-0 left-0 rounded-2 overflow-hidden">
            <DuImage v-if="images?.[0]" :src="images[0]" :width="107" :height="165" radius="8" mode="aspectFill" />
            <div v-else class="w-[107px] h-[165px] rounded-2 bg-hex-cccccc" />
          </div>
        </div>
      </template>

      <!-- 标签 -->
      <DuTag
        v-if="tag"
        :color="tagColor || 'danger'"
        size="small"
        round
        class="absolute right-1 top-1"
      >
        {{ tag }}
      </DuTag>
    </div>

    <!-- 商品名称 -->
    <span v-if="name" class="text-b4 c-text-1 text-center">{{ name }}</span>

    <!-- 想要数量 -->
    <span v-if="wantCount" class="c-text-3 text-b5">{{ wantCount }} 想要</span>

    <slot />
  </div>
</template>
