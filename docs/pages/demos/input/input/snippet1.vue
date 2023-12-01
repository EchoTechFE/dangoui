
<template>
  <PreviewBlock title="最简例子">
    <DuInput placeholder="请输入描述" />
  </PreviewBlock>
  <PreviewBlock title="最简例子">
    <DuInput placeholder="请输入金额" suffix="元" />
  </PreviewBlock>
  <PreviewBlock title="右侧图标">
    <DuInput placeholder="请输入金额" right-icon="arrow-heavy-right" right-icon-size="8px" />
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuInput } from '@frontend/dumpling'
</script>
