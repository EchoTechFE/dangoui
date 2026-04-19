<script setup lang="ts">
// IslandsQuickEntryTitle - 快捷入口标题/图标组件
// 图标是静态 SVG 图形，来自 Figma skeleton
defineProps<{
  icon?: string  // 可选图标标识
}>()
</script>

<template>
  <!-- figma-node: 14205:620256 -->
  <div class="flex gap-1 items-center">
    <slot>
      <!-- 默认图标：斋宫图标 -->
      <div class="bg-[#2b263b] flex-1">
        <div class="bg-[#040000] w-9 h-13" />
        <div class="bg-[#040000] w-3 h-10" />
        <div class="bg-[#040000] w-2 h-2" />
        <div class="bg-[#040000] w-7 h-2" />
        <div class="bg-[#040000] w-3 h-9" />
        <div class="bg-[#040000] w-3 h-5" />
        <div class="bg-[#040000] w-3 h-5" />
      </div>
      <div class="bg-[#2b263b] flex-1">
        <div class="bg-[#040000]" />
        <div class="bg-[#040000] w-2 h-2" />
        <div class="bg-[#040000] w-2 h-2" />
        <div class="bg-[#040000]" />
        <div class="bg-[#040000] w-11 h-6" />
        <div class="bg-[#040000] w-8 h-1" />
        <div class="bg-[#040000] w-8 h-1" />
        <div class="bg-[#040000]" />
        <div class="bg-[#040000] w-3 h-4" />
      </div>
    </slot>
  </div>
</template>
