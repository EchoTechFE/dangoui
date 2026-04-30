<script setup lang="ts">
// HomeIndicator - 主页指示器
defineProps<{
  theme?: 'light' | 'dark'
}>()
</script>

<template>
  <!-- figma-node: 17491:161546 -->
  <div class="w-[134px] h-[5px] rounded-[3px]" :class="theme === 'dark' ? 'bg-white' : 'bg-black'" />
</template>
