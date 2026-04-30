<script setup lang="ts">
// RateSmallSize - 小尺寸评分组件
defineProps<{
  rating?: number
}>()
</script>

<template>
  <div class="flex items-center gap-[2px]">
    <span class="text-[#f96464] text-[12px]">{{ rating || 0 }}</span>
  </div>
</template>
