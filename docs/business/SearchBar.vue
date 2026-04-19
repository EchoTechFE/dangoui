<script setup lang="ts">
// SearchBar - 搜索栏组件
import { DuDivider } from 'dangoui'

defineProps<{
  placeholder?: string
}>()
</script>

<template>
  <!-- figma-node: 14202:xxx -->
  <div
    class="bg-white/12 rounded-8 flex gap-12 items-center py-6 px-12 flex-1"
    @click="$emit('click')"
  >
    <slot name="left">
      <div class="w-16 h-16 bg-white/40 rounded-full" />
    </slot>

    <!-- 搜索文字 -->
    <span class="text-white/40 text-b4 flex-1">{{ placeholder || '搜索' }}</span>

    <slot name="divider">
      <DuDivider type="vertical" class="h-30" />
    </slot>

    <slot name="right" />
  </div>
</template>
