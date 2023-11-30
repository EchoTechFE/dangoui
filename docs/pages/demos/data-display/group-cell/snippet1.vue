
<template>
  <PreviewBlock title="最简例子" :show-section="false">
    <DuGroupCell title="商城" subtitle="66个在卖">
      内容
    </DuGroupCell>
  </PreviewBlock>
  <PreviewBlock title="显示说明按钮" :show-section="false">
    <DuGroupCell title="商城" subtitle="66个在卖" info-text="规格说明">
      内容
    </DuGroupCell>
  </PreviewBlock>
  <PreviewBlock title="展示 Action 图标" :show-section="false">
    <DuGroupCell title="标题" subtitle="子标题" info-text="" guide-text="" action-icon="delete">
      内容
    </DuGroupCell>
  </PreviewBlock>
  <PreviewBlock title="自定义右侧 Slot" :show-section="false">
      <DuGroupCell title="款式">
        <template #right>
          <DuButton size="mini" type="info">我拥有的 8</DuButton>
        </template>
        <div>内容</div>
      </DuGroupCell>
  </PreviewBlock>
    <PreviewBlock title="自定义左侧 Slot" :show-section="false">
      <DuGroupCell title="款式" guide-text="查看所有">
        <template #left>
          <DuButton size="mini" type="info">我拥有的 8</DuButton>
        </template>
        <div>内容</div>
      </DuGroupCell>
  </PreviewBlock>
      <PreviewBlock title="展开/折叠" :show-section="false">
      <DuGroupCell title="款式" guide-text="查看所有" mode="collapse" :default-open="false">
        <template #left>
          <DuButton size="mini" type="info">我拥有的 8</DuButton>
        </template>
        <div>内容</div>
      </DuGroupCell>
  </PreviewBlock>
</template>

<script lang="ts" setup>
import { DuButton, DuGroupCell } from 'dumpling'
</script>
