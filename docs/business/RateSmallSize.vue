<script setup lang="ts">
// RateSmallSize - 小尺寸评分组件
import { DuRate } from 'dangoui'

defineProps<{
  value?: number    // 评分值（0-10，默认 8.6）
  count?: number     // 星数（默认 5）
  showText?: boolean // 是否显示评分文字
}>()
</script>

<template>
  <!-- figma-node: 25139:45183 -->
  <div class="flex gap-1 items-center">
    <DuRate
      :value="value ? value / 2 : 4.3"
      :count="count || 5"
      :size="'small'"
      :disabled="true"
      :half="true"
      color="#fc7e22"
    />
    <span v-if="showText !== false && value" class="text-[#fc7e22] text-b4 fw-500">
      {{ value.toFixed(1) }}
    </span>
  </div>
</template>
