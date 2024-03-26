<template>
  <PreviewBlock title="显示红点">
    <div class="flex items-center gap-x-8px">
      <div class="c-neutral-600 text-14px">你有新消息</div>
      <DuBadge dot always-show />
    </div>
  </PreviewBlock>
  <PreviewBlock title="显示数量">
    <div class="flex items-center gap-x-8px">
      <div class="c-neutral-600 text-14px">你有新消息</div>
      <DuBadge :value="100" :max="99" />
    </div>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuBadge } from 'dangoui'
</script>
