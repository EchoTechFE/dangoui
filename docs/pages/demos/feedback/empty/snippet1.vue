
<template>
  <PreviewBlock title="默认">
    <DuEmpty />
  </PreviewBlock>
  <PreviewBlock title="networkError">
    <DuEmpty image="networkError" />
  </PreviewBlock>
  <PreviewBlock title="offline">
    <DuEmpty image="offline" />
  </PreviewBlock>
  <PreviewBlock title="serviceError">
    <DuEmpty image="serviceError" />
  </PreviewBlock>
  <PreviewBlock title="loadError">
    <DuEmpty image="loadError" />
  </PreviewBlock>
  <PreviewBlock title="success">
    <DuEmpty image="success" />
  </PreviewBlock>
  <PreviewBlock title="error">
    <DuEmpty image="error" />
  </PreviewBlock>
  <PreviewBlock title="empty">
    <DuEmpty image="empty" />
  </PreviewBlock>
  <PreviewBlock title="searchEmpty">
    <DuEmpty image="searchEmpty" />
  </PreviewBlock>
  <PreviewBlock title="contentDeleted">
    <DuEmpty image="contentDeleted" />
  </PreviewBlock>
  <PreviewBlock title="contentInvisible">
    <DuEmpty image="contentInvisible" />
  </PreviewBlock>
  <PreviewBlock title="notFound">
    <DuEmpty image="notFound" />
  </PreviewBlock>
  <PreviewBlock title="verifying">
    <DuEmpty image="verifying" />
  </PreviewBlock>
  <PreviewBlock title="verifySucceeded">
    <DuEmpty image="verifySucceeded" />
  </PreviewBlock>
  <PreviewBlock title="verifyFailed">
    <DuEmpty image="verifyFailed" />
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuEmpty } from 'dumpling'
</script>
