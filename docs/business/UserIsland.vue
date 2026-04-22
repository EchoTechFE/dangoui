<script setup lang="ts">
// UserIsland - 用户岛屿信息
import { DuAvatar } from 'dangoui'

defineProps<{
  username?: string
  avatar?: string
  badge?: string
}>()
</script>

<template>
  <!-- figma-node: 17640:163991 -->
  <div class="flex items-center gap-[8px]">
    <DuAvatar v-if="avatar" :src="avatar" :size="32" />
    <div v-else class="w-[32px] h-[32px] rounded-full bg-hex-cccccc" />
    <span class="text-[#2b263b] text-[14px] font-[500]">{{ username }}</span>
    <span v-if="badge" class="bg-[#d94a4e] text-white text-[10px] px-[4px] py-[2px] rounded-[4px]">{{ badge }}</span>
  </div>
</template>
