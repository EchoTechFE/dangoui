<script setup lang="ts">
// UserIsland - 用户信息组件
import { DuAvatar } from 'dangoui'

defineProps<{
  username?: string
  avatar?: string
}>()
</script>

<template>
  <!-- figma-node: 14205:xxx -->
  <div class="flex gap-4 items-center flex-1">
    <DuAvatar :src="avatar" :size="24" round />
    <span class="c-text-3 text-b5 flex-1">{{ username }}</span>
  </div>
</template>
