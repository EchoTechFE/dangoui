
<template>
  <PreviewBlock title="简单">
    <div class="w-full">
      <DuSearch placeholder="Labubu" @confirm="handleConfirm" />
    </div>
  </PreviewBlock>
  <PreviewBlock title="带右侧操作按钮">
    <div class="w-full">
      <DuSearch
        v-model:value="keyword"
        placeholder="Labubu"
        clearable
        @confirm="handleConfirm"
      >
        <template #right>
          <DuIcon name="camera" />
          <DuDivider />
          <DuIcon name="scanning" />
        </template>
      </DuSearch>
    </div>
  </PreviewBlock>
  <PreviewBlock title="滚动 placeholder">
    <div class="w-full">
      <DuSearch v-model:value="keyword2" :placeholder="placeholders" clearable>
        <template #right>
          <DuIcon name="camera" />
          <DuDivider />
          <DuIcon name="scanning" />
        </template>
      </DuSearch>
    </div>
  </PreviewBlock>
  <PreviewBlock title="readonly/滚动 placeholder">
    <div class="w-full">
      <DuSearch :placeholder="placeholders" readonly>
        <template #right>
          <DuIcon name="camera" />
          <DuDivider />
          <DuIcon name="scanning" />
        </template>
      </DuSearch>
    </div>
  </PreviewBlock>
  <PreviewBlock title="readonly/placeholder">
    <div class="w-full">
      <DuSearch placeholder="Molly" readonly>
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
import { DuSearch, DuIcon, DuDivider } from 'dangoui'

const keyword = ref('')

const placeholders = [
  'Molly',
  'Labubu',
  'Skullpanda'
]

function handleConfirm(value: string) {
  console.log(`[demo] confirm: ${value}`)
}
</script>
