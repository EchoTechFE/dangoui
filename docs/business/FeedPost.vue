<script setup lang="ts">
// FeedPost - Feed 帖子组件
import { DuAvatar, DuIcon, DuTag } from 'dangoui'

defineProps<{
  content?: string
  username?: string
  avatar?: string
  likeCount?: number | string
  image?: string
  isVideo?: boolean
  tag?: string
  showVote?: boolean  // 是否显示投票样式
}>()
</script>

<template>
  <!-- figma-node: 17640:164242 -->
  <div class="flex flex-col items-center">
    <!-- 图片/视频区域 -->
    <div class="rounded-8 bg-hex-cccccc relative overflow-hidden">
      <!-- 占位图片 -->
      <div class="bg-hex-cccccc" style="width: 173.5px; height: 231px;" />

      <!-- 视频播放图标 -->
      <DuIcon
        v-if="isVideo"
        name="video-circle-fill"
        :size="16"
        class="absolute left-4 top-4"
        color="rgba(0,0,0,0.64)"
      />

      <!-- 标签 -->
      <DuTag
        v-if="tag"
        color="primary"
        size="small"
        round
        class="absolute right-4 top-4"
      >
        {{ tag }}
      </DuTag>
    </div>

    <!-- 文字内容 -->
    <div v-if="content" class="w-full mt-8">
      <span class="text-b3 fw-500 c-text-1">{{ content }}</span>
    </div>

    <!-- 用户信息 + 点赞/投票 -->
    <div class="flex justify-between items-center w-full mt-8">
      <div class="flex gap-4 items-center">
        <DuAvatar
          :src="avatar"
          :size="24"
          round
          class="rounded-20"
        />
        <span class="c-text-3 text-b5">{{ username }}</span>
      </div>

      <!-- 投票样式 -->
      <div v-if="showVote" class="flex gap-4 items-center bg-hex-ededf2 rounded-20 px-8 py-4">
        <DuIcon name="vote" :size="10" color="#625e76" />
        <span class="c-text-2 text-b6 fw-500">{{ likeCount }}人投票</span>
      </div>

      <!-- 点赞样式 -->
      <div
        v-else
        class="flex gap-4 items-center c-text-2"
        @click.stop="$emit('like')"
      >
        <DuIcon name="like" :size="13" color="rgba(0,0,0,0.64)" />
        <span class="text-b3 fw-500">{{ likeCount }}</span>
      </div>
    </div>

    <slot />
  </div>
</template>
