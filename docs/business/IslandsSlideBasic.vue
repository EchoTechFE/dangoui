<script setup lang="ts">
// IslandsSlideBasic - 横向滑动商品单项组件
import { DuTag } from 'dangoui'

defineProps<{
  image?: string       // 商品图片
  tag?: string          // 标签文字（如 "+36"、"NEW"）
  tagColor?: string     // 标签颜色
  name?: string         // 商品名称
  wantCount?: string    // 想要数量
}>()
</script>

<template>
  <!-- figma-node: 14202:601976 -->
  <div class="rounded-1 flex flex-col gap-1 items-center w-21 h-30 flex-shrink-0">
    <!-- SPU 图片 + 标签 -->
    <div class="relative">
      <!-- 产品图片占位 -->
      <div class="w-12 h-16 bg-hex-cccccc rounded-2 overflow-hidden">
        <img v-if="image" :src="image" class="w-full h-full object-cover" />
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

    <!-- 商品名称 -->
    <span v-if="name" class="text-b4 c-text-1 text-center">{{ name }}</span>

    <!-- 想要数量 -->
    <span v-if="wantCount" class="c-text-3 text-b5">{{ wantCount }} 想要</span>

    <slot />
  </div>
</template>
