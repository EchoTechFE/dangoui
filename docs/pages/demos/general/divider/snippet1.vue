
<template>
  <PreviewBlock title="默认">
    <DuDivider />
  </PreviewBlock>
  <PreviewBlock title="带文字">
    <DuDivider>分割线</DuDivider>
  </PreviewBlock>
  <PreviewBlock title="垂直">
    <div class="flex items-center gap-x-8px">
      <DuButton
        type="text"
        size="mini"
        icon="multiselection"
      >
        同时搜多款
      </DuButton>
      <DuDivider type="vertical" />
      <DuButton
        type="text"
        size="mini"
        icon="info-circle"
      >
        规格说明
      </DuButton>
    </div>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuDivider, DuButton } from '@frontend/dumpling'
</script>
