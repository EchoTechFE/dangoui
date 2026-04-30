<script setup lang="ts">
// PriceBasic - 价格基础组件
defineProps<{
  price?: string
  size?: 'small' | 'medium' | 'large'
}>()
</script>

<template>
  <div class="flex items-baseline">
    <span class="text-[#f96464] font-[500]" :class="{
      'text-[12px]': size === 'small',
      'text-[14px]': size === 'medium' || !size,
      'text-[16px]': size === 'large'
    }">
      ¥{{ price || '0' }}
    </span>
  </div>
</template>
