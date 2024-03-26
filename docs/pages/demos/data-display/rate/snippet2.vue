
<template>
  <PreviewBlock title="primary">
    <DuRate :value="4" color="primary" />
  </PreviewBlock>
  <PreviewBlock title="secondary">
    <DuRate :value="4" color="secondary" />
  </PreviewBlock>
  <PreviewBlock title="success">
    <DuRate :value="4" color="success" />
  </PreviewBlock>
  <PreviewBlock title="warning">
    <DuRate :value="4" color="warning" />
  </PreviewBlock>
  <PreviewBlock title="error">
    <DuRate :value="4" color="error" />
  </PreviewBlock>
  <PreviewBlock title="trade">
    <DuRate :value="4" color="trade" />
  </PreviewBlock>
  <PreviewBlock title="使用 hex 色值">
    <DuRate :value="4" color="#666" />
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuRate } from '@echotechfe/dumpling'
</script>
