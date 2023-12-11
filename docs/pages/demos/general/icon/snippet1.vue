
<template>
  <PreviewBlock title="最简例子">
    <DuIcon name="two-column" />
    <DuIcon name="label-related" />
  </PreviewBlock>
  <PreviewBlock title="改变颜色">
    <DuIcon name="search" class="text-blue" />
    <DuIcon name="refresh" class="text-yellow" />
  </PreviewBlock>
  <PreviewBlock title="改变大小">
    <DuIcon name="scanning" :size="32" />
    <DuIcon name="copylink" :size="32" />
  </PreviewBlock>
  <PreviewBlock title="使用图片链接">
    <DuIcon name="https://cdn.qiandaoapp.com/interior/images/3ff45be24f8686698cf75886c5d235e0.svg" />
    <DuIcon name="https://cdn.qiandaoapp.com/interior/images/3ff45be24f8686698cf75886c5d235e0.svg" :size="32" />
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuIcon } from '@frontend/dumpling'
</script>
