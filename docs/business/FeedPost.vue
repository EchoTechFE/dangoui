<script setup lang="ts">
// FeedPost - Feed 帖子卡片
import { DuIcon, DuAvatar } from 'dangoui'

defineProps<{
  content?: string
  username?: string
  avatar?: string
  likeCount?: number
  image?: string
  isVideo?: boolean
  tag?: string
}>()

const emit = defineEmits<{
  click: []
  like: []
}>()
</script>

<template>
  <!-- figma-node: 17640:164242 -->
  <div class="bg-white rounded-[8px] p-[12px] flex flex-col gap-[8px]" @click="emit('click')">
    <!-- 用户信息 -->
    <div class="flex items-center gap-[8px]">
      <DuAvatar v-if="avatar" :src="avatar" :size="32" />
      <div v-else class="w-[32px] h-[32px] rounded-full bg-hex-cccccc" />
      <div class="flex flex-col">
        <span class="text-[#2b263b] text-[12px] font-[500]">{{ username }}</span>
        <span v-if="tag" class="text-[#d94a4e] text-[10px]">{{ tag }}</span>
      </div>
    </div>

    <!-- 内容 -->
    <div class="text-[#2b263b] text-[14px] leading-[20px]">{{ content }}</div>

    <!-- 图片/视频 -->
    <div v-if="image || isVideo" class="relative rounded-[8px] overflow-hidden bg-hex-cccccc">
      <div class="w-full h-[150px]" />
      <div v-if="isVideo" class="absolute inset-0 flex items-center justify-center">
        <DuIcon name="play-circle" :size="40" color="white" />
      </div>
    </div>

    <!-- 互动栏 -->
    <div class="flex items-center gap-[16px]">
      <div class="flex items-center gap-[4px]" @click.stop="emit('like')">
        <DuIcon name="heart" :size="16" color="rgba(0,0,0,0.4)" />
        <span class="text-[rgba(0,0,0,0.4)] text-[12px]">{{ likeCount }}</span>
      </div>
    </div>
  </div>
</template>
