
<template>
  <PreviewBlock title="基础">
    <DuButton type="secondary" @click="topVisible = true">打开底部</DuButton>
    <DuButton type="secondary" @click="visible = true">打开弹窗</DuButton>
    <DuButton type="secondary" @click="bottomVisible = true">打开顶部</DuButton>
  </PreviewBlock>
  <DuPopup v-model:visible="topVisible" title="请选择" type="bottom">
    内容
  </DuPopup>
  <DuPopup v-model:visible="visible" title="公告">
    从 12 月 1 日起，必须使用该弹窗组件
  </DuPopup>
  <DuPopup v-model:visible="bottomVisible" title="公告" type="top">
    内容
  </DuPopup>
</template>

<script setup lang="ts">
import { DuButton, DuPopup } from '@echofe/dumpling'

const topVisible = ref(false)
const visible = ref(false)
const bottomVisible = ref(false)
</script>
