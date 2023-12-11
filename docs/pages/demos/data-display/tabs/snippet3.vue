
<template>
  <PreviewBlock title="默认/带有操作按钮" type="block">
    <Tabs v-model:value="selectedTab" size="normal">
      <Tab name="all">全部</Tab>
      <Tab name="wiki">资料</Tab>
      <Tab name="community">社区</Tab>
      <Tab name="trade">转卖</Tab>
      <Tab name="stock">闪购</Tab>
      <Tab name="buy">求购</Tab>
      <Tab name="purchaseway">全网</Tab>
      <template #right>
        <DuTabsRight>
          <DuButton type="text" size="small" icon="sort" icon-position="right">测试1</DuButton>
          <DuDivider />
          <DuButton type="text" size="small" icon="sort" icon-position="right">测试2</DuButton>
        </DuTabsRight>
      </template>
    </Tabs>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, Tab, DuTabsRight, DuButton, DuDivider } from '@frontend/dumpling'

const selectedTab = ref('all')
</script>
