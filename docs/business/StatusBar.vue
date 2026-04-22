<script setup lang="ts">
// StatusBar - 状态栏
defineProps<{
  time?: string
  color?: 'white' | 'black'
  type?: string
}>()
</script>

<template>
  <!-- figma-node: 17485:316191 -->
  <div class="flex justify-between items-center h-[20px] px-[16px]">
    <span class="text-[14px] font-[500]" :class="color === 'white' ? 'text-white' : 'text-black'">{{ time || '9:41' }}</span>
    <div class="flex items-center gap-[4px]">
      <div class="w-[16px] h-[10px] border border-current rounded-[2px]" :class="color === 'white' ? 'border-white' : 'border-black'" />
    </div>
  </div>
</template>
