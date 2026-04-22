<script setup lang="ts">
// SPU - 横向滑动商品卡片组件
import { DuTag, DuImage } from 'dangoui'
import SPUBasic from './SPUBasic.vue'

defineProps<{
  image?: string        // 商品图片
  images?: string[]     // 商品图片数组（叠层）
  tag?: string          // 标签（如 "NEW"）
  tagColor?: string     // 标签颜色
  name?: string         // 商品名称
  wantCount?: string    // 想要数量（如 "224"）
  useStack?: boolean    // 是否使用叠层效果
}>()
</script>

<template>
  <!-- figma-node: 17640:150568 -->
  <div class="rounded-1 flex flex-col gap-1 items-center w-[74px] h-[134px] flex-shrink-0">
    <!-- 图片区域 -->
    <div class="relative">
      <div v-if="useStack" class="rounded-2 overflow-hidden">
        <SPUBasic :images="images" size="large" />
      </div>
      <div v-else class="rounded-2 overflow-hidden">
        <DuImage
          v-if="image"
          :src="image"
          :width="74"
          :height="134"
          radius="8"
          mode="aspectFill"
        />
        <div v-else class="w-[74px] h-[134px] rounded-2 bg-hex-cccccc" />
      </div>

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

    <!-- 商品信息 -->
    <div class="flex flex-col gap-1">
      <span v-if="name" class="text-b4 c-text-1 text-center">{{ name }}</span>
      <span v-if="wantCount" class="c-text-3 text-b5 text-center">{{ wantCount }} 想要</span>
    </div>

    <slot />
  </div>
</template>
