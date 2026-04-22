<script setup lang="ts">
// PriceBasic - 价格展示基础组件
defineProps<{
  price: string | number   // 价格数字
  currency?: string       // 货币符号（默认 ¥）
  suffix?: string        // 后缀（如 "起"）
  size?: 'small' | 'medium' | 'large'
}>()
</script>

<template>
  <!-- figma-node: 43607:41080 -->
  <div
    class="flex gap-1 items-center"
    :class="{
      'gap-1': size === 'small',
      'gap-2': size === 'medium' || !size,
    }"
  >
    <!-- 货币符号 -->
    <span class="text-[#f96464]" :class="{
      'text-b5': size === 'small',
      'text-b4': size === 'medium' || !size,
      'text-h4': size === 'large'
    }">
      {{ currency || '¥' }}
    </span>

    <!-- 价格整数部分 -->
    <span class="text-[#f96464] fw-500" :class="{
      'text-b5': size === 'small',
      'text-b4': size === 'medium' || !size,
      'text-h4': size === 'large'
    }">
      {{ price }}
    </span>

    <!-- 价格小数部分（如果有） -->
    <slot name="decimal" />

    <!-- 后缀 -->
    <span v-if="suffix" class="text-[#f96464]" :class="{
      'text-b5': size === 'small',
      'text-b4': size === 'medium' || !size,
      'text-h4': size === 'large'
    }">
      {{ suffix }}
    </span>
  </div>
</template>
