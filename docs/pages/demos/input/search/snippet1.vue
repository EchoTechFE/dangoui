
<template>
  <PreviewBlock title="简单">
    <div class="w-full">
      <DuSearch placeholder="Labubu" />
    </div>
  </PreviewBlock>
  <PreviewBlock title="带右侧操作按钮">
    <div class="w-full">
      <DuSearch v-model:value="keyword" placeholder="Labubu" clearable>
        <template #right>
          <DuIcon name="camera" />
          <DuDivider />
          <DuIcon name="scanning" />
        </template>
      </DuSearch>
    </div>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuSearch, DuIcon, DuDivider } from '@frontend/dumpling'

const keyword = ref('')
</script>
