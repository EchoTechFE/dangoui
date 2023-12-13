
<template>
  <PreviewBlock title="默认/带有操作按钮" type="block">
    <DuTabs v-model:value="selectedTab" size="large">
      <DuTab name="all">全部</DuTab>
      <DuTab name="wiki">资料</DuTab>
      <DuTab name="community">社区</DuTab>
      <DuTab name="trade">转卖</DuTab>
      <DuTab name="stock">闪购</DuTab>
      <DuTab name="buy">求购</DuTab>
      <DuTab name="purchaseway">全网</DuTab>
      <template #right>
        <DuButton type="text" size="small" icon="sort" icon-position="right">测试1</DuButton>
        <DuDivider />
        <DuButton type="text" size="small" icon="sort" icon-position="right">测试2</DuButton>
      </template>
    </DuTabs>
  </PreviewBlock>
  <PreviewBlock title="tag 类型" type="block">
    <DuTabs v-model:value="selectedTab" type="tag" size="large">
      <DuTab name="all">全部</DuTab>
      <DuTab name="wiki">资料</DuTab>
      <DuTab name="community">社区</DuTab>
      <DuTab name="trade">转卖</DuTab>
      <DuTab name="stock">闪购</DuTab>
      <DuTab name="buy">求购</DuTab>
      <DuTab name="purchaseway">全网</DuTab>
      <template #right>
        <DuButton color="primary" type="text" size="small" icon="sort" icon-position="right">排序</DuButton>
        <DuDivider />
        <DuButton type="text" size="small" icon="sort" icon-position="right">测试2</DuButton>
      </template>
    </DuTabs>
  </PreviewBlock>
  <PreviewBlock title="文字类型" type="block">
    <DuTabs v-model:value="selectedTab" type="text" size="large">
      <DuTab name="all">全部</DuTab>
      <DuDivider />
      <DuTab name="wiki">资料</DuTab>
      <DuDivider />
      <DuTab name="community">社区</DuTab>
      <DuDivider />
      <DuTab name="trade">转卖</DuTab>
      <DuDivider />
      <DuTab name="stock">闪购</DuTab>
      <DuDivider />
      <DuTab name="buy">求购</DuTab>
      <DuDivider />
      <DuTab name="purchaseway">全网</DuTab>
      <template #right>
        <DuButton color="primary" type="text" size="small" icon="sort" icon-position="right">排序</DuButton>
        <DuDivider />
        <DuButton type="text" size="small" icon="sort" icon-position="right">测试2</DuButton>
      </template>
    </DuTabs>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuTabs, DuTab, DuButton, DuDivider } from '@frontend/dumpling'

const selectedTab = ref('all')
</script>
