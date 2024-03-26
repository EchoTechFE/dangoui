<template>
  <PreviewBlock title="字数统计">
    <div class="flex-auto">
      <DuTextarea
        placeholder="请输入..."
        show-count
        v-model:value="text2"
        bordered
      />
    </div>
  </PreviewBlock>
  <PreviewBlock title="设置字数上限">
    <div class="flex-auto">
      <DuTextarea
        placeholder="请输入..."
        show-count
        v-model:value="text3"
        :maxlength="16"
        bordered
      />
    </div>
  </PreviewBlock>
  <PreviewBlock title="超出字数上限">
    <div class="flex-auto">
      <DuTextarea
        placeholder="请输入..."
        show-count
        v-model:value="text4"
        :maxlength="16"
        bordered
      />
    </div>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuTextarea } from 'dangoui'

const text = ref('')

const text2 = ref('')

const text3 = ref('')

const text4 = ref(
  '长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字',
)
</script>
