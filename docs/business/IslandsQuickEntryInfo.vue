<script setup lang="ts">
// IslandsQuickEntryInfo - 快捷入口描述信息组件
defineProps<{
  text?: string  // 信息文字
}>()
</script>

<template>
  <!-- figma-node: 14205:620382 -->
  <div class="flex flex-col justify-end w-[135px] h-[18px]">
    <span class="c-text-3 text-b5">{{ text || '一二三四五六七八九十' }}</span>
  </div>
</template>
