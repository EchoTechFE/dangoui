<script setup lang="ts">
// PriceEcho - 价格回显组件
import PriceBasic from './PriceBasic.vue'

defineProps<{
  price?: string
  unit?: string
  size?: 'small' | 'medium' | 'large'
}>()
</script>

<template>
  <div class="flex items-baseline gap-[2px]">
    <PriceBasic :price="price" :size="size" />
    <span v-if="unit" class="text-[#f96464] text-[12px]">{{ unit }}</span>
  </div>
</template>
