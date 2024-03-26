
<template>
  <PreviewBlock title="secondary">
    <DuInputNumber :min="0" :max="6" highlight-add color="secondary" />
  </PreviewBlock>
  <PreviewBlock title="success">
    <DuInputNumber :min="0" :max="6" highlight-add color="success" />
  </PreviewBlock>
  <PreviewBlock title="warning">
    <DuInputNumber :min="0" :max="6" highlight-add color="warning" />
  </PreviewBlock>
  <PreviewBlock title="error">
    <DuInputNumber :min="0" :max="6" highlight-add color="error" />
  </PreviewBlock>
  <PreviewBlock title="trade">
    <DuInputNumber :min="0" :max="6" highlight-add color="trade" />
  </PreviewBlock>
  <PreviewBlock title="vip">
    <DuInputNumber :min="0" :max="6" highlight-add color="vip" />
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuInputNumber } from '@echotechfe/dumpling'
</script>
