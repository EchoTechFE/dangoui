
<template>
  <PreviewBlock title="默认">
    <DuEmpty />
  </PreviewBlock>
  <PreviewBlock title="networkError">
    <DuEmpty image="networkError" text="网络异常" />
  </PreviewBlock>
  <PreviewBlock title="offline">
    <DuEmpty image="offline" text="无网络" />
  </PreviewBlock>
  <PreviewBlock title="serviceError">
    <DuEmpty image="serviceError" text="服务器异常" />
  </PreviewBlock>
  <PreviewBlock title="loadError">
    <DuEmpty image="loadError" text="加载失败" />
  </PreviewBlock>
  <PreviewBlock title="success">
    <DuEmpty image="success" text="全局成功" />
  </PreviewBlock>
  <PreviewBlock title="error">
    <DuEmpty image="error" text="全局失败" />
  </PreviewBlock>
  <PreviewBlock title="empty">
    <DuEmpty image="empty" text="全局空数据" />
  </PreviewBlock>
  <PreviewBlock title="searchEmpty">
    <DuEmpty image="searchEmpty" text="搜索无结果" />
  </PreviewBlock>
  <PreviewBlock title="contentDeleted">
    <DuEmpty image="contentDeleted" text="内容已删除" />
  </PreviewBlock>
  <PreviewBlock title="contentInvisible">
    <DuEmpty image="contentInvisible" text="内容已下架" />
  </PreviewBlock>
  <PreviewBlock title="notFound">
    <DuEmpty image="notFound" text="内容不存在" />
  </PreviewBlock>
  <PreviewBlock title="verifying">
    <DuEmpty image="verifying" text="审核中" />
  </PreviewBlock>
  <PreviewBlock title="verifySucceeded">
    <DuEmpty image="verifySucceeded" text="审核通过" />
  </PreviewBlock>
  <PreviewBlock title="verifyFailed">
    <DuEmpty image="verifyFailed" text="审核失败" />
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuEmpty } from '@echotechfe/dumpling'
</script>
