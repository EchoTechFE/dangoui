
<template>
  <PreviewBlock title="secondary">
    <InputNumber :min="0" :max="6" highlight-add color="secondary" />
  </PreviewBlock>
  <PreviewBlock title="success">
    <InputNumber :min="0" :max="6" highlight-add color="success" />
  </PreviewBlock>
  <PreviewBlock title="warning">
    <InputNumber :min="0" :max="6" highlight-add color="warning" />
  </PreviewBlock>
  <PreviewBlock title="error">
    <InputNumber :min="0" :max="6" highlight-add color="error" />
  </PreviewBlock>
  <PreviewBlock title="trade">
    <InputNumber :min="0" :max="6" highlight-add color="trade" />
  </PreviewBlock>
  <PreviewBlock title="vip">
    <InputNumber :min="0" :max="6" highlight-add color="vip" />
  </PreviewBlock>
</template>

<script setup lang="ts">
import { InputNumber } from '@frontend/dumpling'
</script>
