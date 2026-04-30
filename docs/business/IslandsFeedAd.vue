<script setup lang="ts">
// IslandsFeedAd - Feed 流广告卡片
defineProps<{
  image?: string
  title?: string
}>()
</script>

<template>
  <!-- figma-node: 17282:11928 -->
  <div class="rounded-[8px] overflow-hidden bg-[#f7f7f9]">
    <div v-if="image" class="w-full h-[120px] bg-hex-cccccc" />
    <div v-else class="w-full h-[120px] bg-hex-cccccc flex items-center justify-center">
      <span class="text-[rgba(0,0,0,0.4)] text-[12px]">广告</span>
    </div>
  </div>
</template>
