<script setup lang="ts">
// PriceEcho - 价格展示组件（带货币图标）
import PriceBasic from './PriceBasic.vue'

defineProps<{
  price: string | number   // 价格数字
  currency?: string       // 货币符号（默认 ¥）
  suffix?: string        // 后缀（如 "起"）
  icon?: string          // 货币图标（默认是紫色方块图标）
  size?: 'small' | 'medium' | 'large'
}>()
</script>

<template>
  <!-- figma-node: 80671:34561 -->
  <div class="flex gap-1 items-center">
    <!-- 货币图标（紫色方块） -->
    <div v-if="icon !== 'none'" class="bg-[#7c66ff] w-3 h-3 rounded-1" />

    <!-- 价格 -->
    <PriceBasic :price="price" :currency="currency" :suffix="suffix" :size="size">
      <template #decimal>
        <slot name="decimal" />
      </template>
    </PriceBasic>
  </div>
</template>
