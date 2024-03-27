
<template>
  <PreviewBlock title="列表">
    <DuButton @click="listOpen = true">开放列表分享面板</DuButton>
    <DuActionSheet v-model:open="listOpen" :items="items" />
  </PreviewBlock>
  <PreviewBlock title="宫格">
    <DuButton @click="gridOpen = true">开放宫格分享面板</DuButton>
    <DuActionSheet v-model:open="gridOpen" type="grid" :items="items" />
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuActionSheet, DuButton } from 'dangoui'

const listOpen = ref(false)

const gridOpen = ref(false)

const items = [
  {
    label: '微信',
    icon: 'wechat-colorful'
  },
  {
    label: '复制链接',
    icon: 'copylink'
  },
  {
    label: '生成海报',
    icon: 'photo'
  },
  {
    label: '编辑',
    icon: 'edit'
  },
  {
    label: '删除',
    icon: 'delete'
  },
  {
    label: '举报',
    icon: 'warning'
  }
]
</script>
