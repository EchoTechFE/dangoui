
<template>
  <PreviewBlock title="最简例子">
    <DuIcon name="two-column" />
    <DuIcon name="label-related" />
  </PreviewBlock>
  <PreviewBlock title="改变颜色/使用 CSS color 属性">
    <div class="text-blue text-sm">
      <DuIcon name="refresh" class="mr-4px" />
      <span>这是一个图标加文案，都是同一种颜色</span>
    </div>
  </PreviewBlock>
  <PreviewBlock title="改变颜色/直接使用 color 属性">
    <DuIcon name="refresh" color="primary" />
    <DuIcon name="refresh" color="secondary" />
    <DuIcon name="refresh" color="success" />
    <DuIcon name="refresh" color="warning" />
    <DuIcon name="refresh" color="error" />
    <DuIcon name="refresh" color="trade" />
    <DuIcon name="wifi" color="#06b6d4" />
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
import { DuIcon } from '@echofe/dumpling'
</script>
