
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
        color="default"
        type="text"
        size="mini"
        icon="multiselection"
      >
        同时搜多款
      </DuButton>
      <DuDivider type="vertical" />
      <DuButton
        color="default"
        type="text"
        size="mini"
        icon="info-circle"
      >
        规格说明
      </DuButton>
    </div>
  </PreviewBlock>
  <PreviewBlock title="水平/指定长度">
    <div class="flex flex-auto justify-center items-center">
      <DuDivider type="horizontal" :length="240" />
    </div>
  </PreviewBlock>
  <PreviewBlock title="垂直/指定高度">
    <div class="flex items-center gap-x-8px">
      <DuButton
        color="default"
        type="text"
        size="mini"
        icon="multiselection"
      >
        同时搜多款
      </DuButton>
      <DuDivider type="vertical" :length="12" />
      <DuButton
        color="default"
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
import { DuDivider, DuButton } from '@echofe/dumpling'
</script>
