<script setup lang="ts">
// ButtonIcon - 图标按钮
defineProps<{
  label?: string
}>()
</script>

<template>
  <!-- figma-node: 17235:144772 -->
  <div class="flex items-center gap-[4px] px-[8px] py-[4px]">
    <span class="text-white text-[14px]">{{ label }}</span>
  </div>
</template>
