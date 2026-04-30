<script setup lang="ts">
// IslandsQuickEntryTitle - 快捷入口标题/图标
defineProps<{
  title?: string
}>()
</script>

<template>
  <!-- figma-node: 14205:620256 -->
  <div class="flex gap-[1px] items-center">
    <slot />
    <span v-if="title" class="text-[#2b263b] text-[15px] font-[1000] leading-[12px]">{{ title }}</span>
  </div>
</template>
