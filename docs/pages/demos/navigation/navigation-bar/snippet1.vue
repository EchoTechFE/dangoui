
<template>
  <div class="min-h-screen bg-white">
    <DuNavigationBar share>
      标题
      <template #right>
        <DuButton size="small" type="info" >按钮</DuButton>
      </template>
    </DuNavigationBar>
  </div>
</template>

<script setup lang="ts">
import { DuNavigationBar, DuButton } from '@frontend/dumpling'
</script>
