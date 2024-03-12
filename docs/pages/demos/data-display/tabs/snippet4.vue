
<template>
  <PreviewBlock title="secondary" type="block">
    <DuTabs v-model:value="selectedTab" color="secondary" type="tag">
      <DuTab name="all">全部</DuTab>
      <DuTab name="wiki">资料</DuTab>
      <DuTab name="community">社区</DuTab>
      <DuTab name="trade">转卖</DuTab>
      <DuTab name="stock">闪购</DuTab>
      <DuTab name="buy">求购</DuTab>
      <DuTab name="purchaseway">全网</DuTab>
    </DuTabs>
  </PreviewBlock>
  <PreviewBlock title="success" type="block">
    <DuTabs v-model:value="selectedTab" color="success" type="tag">
      <DuTab name="all">全部</DuTab>
      <DuTab name="wiki">资料</DuTab>
      <DuTab name="community">社区</DuTab>
      <DuTab name="trade">转卖</DuTab>
      <DuTab name="stock">闪购</DuTab>
      <DuTab name="buy">求购</DuTab>
      <DuTab name="purchaseway">全网</DuTab>
    </DuTabs>
  </PreviewBlock>
  <PreviewBlock title="warning" type="block">
    <DuTabs v-model:value="selectedTab" color="warning" type="tag">
      <DuTab name="all">全部</DuTab>
      <DuTab name="wiki">资料</DuTab>
      <DuTab name="community">社区</DuTab>
      <DuTab name="trade">转卖</DuTab>
      <DuTab name="stock">闪购</DuTab>
      <DuTab name="buy">求购</DuTab>
      <DuTab name="purchaseway">全网</DuTab>
    </DuTabs>
  </PreviewBlock>
  <PreviewBlock title="warning" type="block">
    <DuTabs v-model:value="selectedTab" color="error" type="tag">
      <DuTab name="all">全部</DuTab>
      <DuTab name="wiki">资料</DuTab>
      <DuTab name="community">社区</DuTab>
      <DuTab name="trade">转卖</DuTab>
      <DuTab name="stock">闪购</DuTab>
      <DuTab name="buy">求购</DuTab>
      <DuTab name="purchaseway">全网</DuTab>
    </DuTabs>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuTabs, DuTab, DuButton, DuDivider } from '@frontend/dumpling'

const selectedTab = ref('all')
</script>
