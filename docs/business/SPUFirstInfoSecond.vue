<script setup lang="ts">
// SPUFirstInfoSecond - 商品信息优先展示
defineProps<{
  name?: string
  wantCount?: string | number
  activityCount?: string | number
}>()
</script>

<template>
  <div class="flex flex-col gap-[2px]">
    <span class="text-[#2b263b] text-[12px] font-[400] leading-[18px]">{{ name }}</span>
    <span class="text-[rgba(0,0,0,0.4)] text-[10px] font-[400] leading-[11px]">{{ wantCount || activityCount }} 想要</span>
  </div>
</template>
