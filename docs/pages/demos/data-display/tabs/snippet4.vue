
<template>
  <PreviewBlock title="默认/带有操作按钮" type="block">
    <Tabs v-model:value="selectedTab" size="large">
      <Tab name="all">全部</Tab>
      <Tab name="wiki">资料</Tab>
      <Tab name="community">社区</Tab>
      <Tab name="trade">转卖</Tab>
      <Tab name="stock">闪购</Tab>
      <Tab name="buy">求购</Tab>
      <Tab name="purchaseway">全网</Tab>
      <template #right>
        <DuButton type="text" size="small" icon="sort" icon-position="right">测试1</DuButton>
        <DuDivider />
        <DuButton type="text" size="small" icon="sort" icon-position="right">测试2</DuButton>
      </template>
    </Tabs>
  </PreviewBlock>
  <PreviewBlock title="tag 类型" type="block">
    <Tabs v-model:value="selectedTab" type="tag" size="large">
      <Tab name="all">全部</Tab>
      <Tab name="wiki">资料</Tab>
      <Tab name="community">社区</Tab>
      <Tab name="trade">转卖</Tab>
      <Tab name="stock">闪购</Tab>
      <Tab name="buy">求购</Tab>
      <Tab name="purchaseway">全网</Tab>
      <template #right>
        <DuButton color="primary" type="text" size="small" icon="sort" icon-position="right">排序</DuButton>
        <DuDivider />
        <DuButton type="text" size="small" icon="sort" icon-position="right">测试2</DuButton>
      </template>
    </Tabs>
  </PreviewBlock>
  <PreviewBlock title="文字类型" type="block">
    <Tabs v-model:value="selectedTab" type="text" size="large">
      <Tab name="all">全部</Tab>
      <DuDivider />
      <Tab name="wiki">资料</Tab>
      <DuDivider />
      <Tab name="community">社区</Tab>
      <DuDivider />
      <Tab name="trade">转卖</Tab>
      <DuDivider />
      <Tab name="stock">闪购</Tab>
      <DuDivider />
      <Tab name="buy">求购</Tab>
      <DuDivider />
      <Tab name="purchaseway">全网</Tab>
      <template #right>
        <DuButton color="primary" type="text" size="small" icon="sort" icon-position="right">排序</DuButton>
        <DuDivider />
        <DuButton type="text" size="small" icon="sort" icon-position="right">测试2</DuButton>
      </template>
    </Tabs>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, Tab, DuButton, DuDivider } from '@frontend/dumpling'

const selectedTab = ref('all')
</script>
