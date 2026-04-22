<script setup lang="ts">
// IslandsPinBasic - 底部 TabBar 单项
import { DuIcon, DuBadge } from 'dangoui'

defineProps<{
  name: string
  icon?: string
  badge?: number | string
  active?: boolean
}>()
</script>

<template>
  <!-- figma-node: 14210:714253 -->
  <div class="flex flex-col items-center gap-[2px] py-[4px] px-[8px]">
    <div class="relative">
      <DuIcon :name="icon || 'home'" :size="24" :color="active ? '#7c66ff' : 'rgba(0,0,0,0.4)'" />
      <DuBadge v-if="badge" :content="badge" class="absolute -top-[4px] -right-[4px]" />
    </div>
    <span class="text-[10px]" :class="active ? 'text-[#7c66ff]' : 'text-[rgba(0,0,0,0.4)]'">{{ name }}</span>
  </div>
</template>
