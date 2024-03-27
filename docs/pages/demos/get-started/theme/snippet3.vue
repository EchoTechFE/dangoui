
<template>
  <PreviewBlock title="传递 trade">
    <DuTheme name="qd">
      <div class="flex flex-col gap-8px">
        <DuButton color="trade">完成</DuButton>
        <DuSwitch color="trade" on />
      </div>
    </DuTheme>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuButton, DuSwitch, DuTheme } from 'dangoui'
</script>
