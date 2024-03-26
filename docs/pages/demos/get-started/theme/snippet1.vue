
<template>
  <PreviewBlock title="传递 success">
    <div class="flex flex-col gap-8px">
      <DuButton color="success">完成</DuButton>
      <DuSwitch color="success" on />
    </div>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuButton, DuSwitch } from '@echofe/dumpling'
</script>
