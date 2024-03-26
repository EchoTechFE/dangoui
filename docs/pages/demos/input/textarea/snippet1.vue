<template>
  <PreviewBlock title="无边框">
    <div class="flex-auto">
      <DuTextarea placeholder="请输入..." v-model:value="text" />
    </div>
  </PreviewBlock>
  <PreviewBlock title="带边框">
    <div class="flex-auto">
      <DuTextarea placeholder="请输入..." v-model:value="text2" bordered />
    </div>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuTextarea } from 'dangoui'

const text = ref('')

const text2 = ref('')
</script>
