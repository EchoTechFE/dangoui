
<template>
  <PreviewBlock title="基础">
    <DuSnackbar :button-props="{ text: '加入' }">
      加入岛，和 666 人一起讨论
    </DuSnackbar>
  </PreviewBlock>
  <PreviewBlock title="显示关闭按钮">
    <DuSnackbar show-close :button-props="{ text: '加入' }">
      加入岛，和 666 人一起讨论
    </DuSnackbar>
  </PreviewBlock>
  <PreviewBlock title="不展示按钮">
    <DuSnackbar show-close :show-action-btn="false" :button-props="{ text: '加入' }">
      加入岛，和 666 人一起讨论
    </DuSnackbar>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuSnackbar } from 'dangoui'
</script>
