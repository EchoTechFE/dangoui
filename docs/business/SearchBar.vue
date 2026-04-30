<script setup lang="ts">
// SearchBar - 搜索栏
defineProps<{
  placeholder?: string
}>()
</script>

<template>
  <!-- figma-node: 17567:44841 -->
  <div class="flex-1 bg-white/20 rounded-[8px] px-[8px] py-[6px] flex items-center gap-[8px]">
    <slot name="left" />
    <span class="text-white/60 text-[14px] flex-1">{{ placeholder }}</span>
    <slot name="right" />
  </div>
</template>
