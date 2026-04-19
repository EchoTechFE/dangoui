<script setup lang="ts">
// IslandsQuickEntryInfo - 快捷入口描述信息组件
defineProps<{
  subtitle?: string  // 副标题
  price?: string     // 价格
  unit?: string      // 单位（元、时、分等）
}>()
</script>

<template>
  <!-- figma-node: 14205:620379 -->
  <div class="flex flex-col gap-2">
    <span v-if="subtitle" class="c-text-3 text-b6">{{ subtitle }}</span>
    <div v-if="price" class="flex items-center">
      <span class="c-danger text-b4 fw-500">¥</span>
      <span class="c-danger text-b4 fw-500">{{ price }}</span>
      <span v-if="unit" class="c-danger text-b6 fw-500">{{ unit }}</span>
    </div>
    <slot />
  </div>
</template>
