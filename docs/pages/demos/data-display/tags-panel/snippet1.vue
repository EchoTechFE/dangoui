<template>
  <PreviewBlock title="基础">
    <DuTagsPanel :tags="tags" @add="handleAddClick" @remove="handleRemove" />
  </PreviewBlock>
  <PreviewBlock title="支持展开">
    <DuTagsPanel
      :tags="tags"
      @add="handleAddClick"
      @remove="handleRemove"
      :collapse-count="5"
    />
  </PreviewBlock>
  <PreviewBlock title="支持展开收起">
    <DuTagsPanel
      :tags="tags"
      @add="handleAddClick"
      @remove="handleRemove"
      :collapse-count="5"
      can-toggle
    />
  </PreviewBlock>
  <PreviewBlock title="使用 add 插槽">
    <DuTagsPanel
      :tags="tags"
      @add="handleAddClick"
      @remove="handleRemove"
      :collapse-count="5"
      can-toggle
    >
      <template #add>
        <DuButton size="small" type="outline">
          添加
          <span style="color: gray; font-weight: 400" @click="handleAddClick">
            （可选）
          </span>
        </DuButton>
      </template>
    </DuTagsPanel>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuTagsPanel, DuButton } from 'dangoui'

const tags = [
  '你好',
  'Hello',
  '안녕하세요',
  'Bonjour',
  'こんにちは',
  'Hallo',
].map((text) => ({ value: text, text, canRemove: text !== '你好' }))

function handleAddClick() {
  console.log('[demo] add click')
}

function handleRemove(item) {
  console.log('[demo] remove', item.value)
}
</script>
