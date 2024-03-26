
<template>
  <DuNavigationBar fixed placeholder>标题</DuNavigationBar>
  <div class="h-200vh bg-white">
    <div class="bg-blue w-100px h-100px mb-8px rd-8px" />
    <DuSticky>
      <DuButton>距离顶部0px</DuButton>
    </DuSticky>
    <div class="bg-blue w-100px h-100px my-8px rd-8px" />
    <DuSticky :top="50">
      <DuButton>距离顶部50px</DuButton>
    </DuSticky>
  </div>
</template>

<script setup lang="ts">
import { DuNavigationBar, DuSticky, DuButton } from '@echofe/dumpling'
</script>
