<script setup lang="ts">
// IslandsFeedAd - Feed 广告卡片组件
defineProps<{
  image?: string
}>()
</script>

<template>
  <!-- figma-node: 17282:11928 -->
  <div class="rounded-8 flex flex-col gap-4 items-center overflow-hidden">
    <div class="rounded-8 flex flex-col gap-10 p-10 bg-hex-cccccc">
      <!-- 进度条 -->
      <div class="flex gap-4" style="width: 157px; height: 2px;">
        <div class="border border-black/8 bg-white/40 flex-1 rounded" />
        <div class="border border-black/8 bg-white/40 flex-1 rounded" />
        <div class="border border-black/8 bg-white flex-1 rounded" />
        <div class="border border-black/8 bg-white/40 flex-1 rounded" />
        <div class="border border-black/8 bg-white/40 flex-1 rounded" />
      </div>
    </div>
  </div>
</template>
