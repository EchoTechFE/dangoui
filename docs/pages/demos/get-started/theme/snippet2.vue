
<template>
  <PreviewBlock title="传递 secondary">
    <div class="flex flex-col gap-8px">
      <DuButton color="secondary">完成</DuButton>
      <DuSwitch color="secondary" on />
    </div>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuButton, DuSwitch } from '@frontend/dumpling'
</script>
