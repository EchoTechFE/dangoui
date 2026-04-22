<script setup lang="ts">
// IslandsPin - 底部 TabBar 容器
defineProps<{
  tabs?: Array<{ id: string; name: string; icon?: string; badge?: number | string }>
  activeTab?: string
}>()
</script>

<template>
  <!-- figma-node: 14210:714253 -->
  <div class="bg-white b-t-1 b-t-solid b-hex-0000001f flex justify-around items-center h-[50px]">
    <slot />
  </div>
</template>
