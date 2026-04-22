<script setup lang="ts">
// IslandsQuickEntryInfo - 快捷入口信息
defineProps<{
  subtitle?: string
  price?: string
  unit?: string
}>()
</script>

<template>
  <!-- figma-node: 14205:620379 -->
  <div class="flex flex-col gap-[2px] justify-center">
    <span v-if="subtitle" class="text-[rgba(0,0,0,0.4)] text-[10px] font-[400] leading-[11px]">{{ subtitle }}</span>
    <div v-if="price" class="flex items-center">
      <span class="text-[#f96464] text-[12px] font-[500] leading-[18px]">¥</span>
      <span class="text-[#f96464] text-[12px] font-[500] leading-[18px]">{{ price }}</span>
      <span v-if="unit" class="text-[#f96464] text-[12px] font-[500] leading-[18px]">{{ unit }}</span>
    </div>
  </div>
</template>
