<script setup lang="ts">
// TabsBasic - Tab 标签单项
defineProps<{
  active?: boolean
}>()
</script>

<template>
  <!-- figma-node: 17485:229365 -->
  <div class="flex gap-[2px] justify-center items-center py-[3px] px-[10px] rounded-[4px]" :class="active ? 'bg-[#2b263b]' : ''">
    <span class="text-[16px] leading-[24px]" :class="active ? 'text-black font-[500]' : 'text-[rgba(0,0,0,0.4)] font-[400]'">
      <slot />
    </span>
  </div>
</template>
