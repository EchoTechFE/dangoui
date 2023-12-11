
<template>
  <PreviewBlock title="带右侧操作按钮">
    <div class="w-full">
      <DuSearch v-model:value="keyword" placeholder="Labubu" clearable>
        <template #right>
          <DuSearchRight>
            <DuIcon name="camera" />
            <DuDivider />
            <DuIcon name="scanning" />
          </DuSearchRight>
        </template>
      </DuSearch>
    </div>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuSearch, DuSearchRight, DuIcon, DuDivider } from '@frontend/dumpling'

const keyword = ref('')
</script>
