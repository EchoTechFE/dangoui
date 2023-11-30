
<template>
  <PreviewBlock title="简单例子">
    <DuCheckbox v-model:checked="checked" />

    <DuCheckbox v-model:checked="checked" label="是否公开" position="left" />

    <DuCheckbox v-model:checked="checked" label="是否公开" position="right" />
  </PreviewBlock>
  <PreviewBlock title="Checkbox Group">
    <DuCheckboxGroup v-model:value="checkedItems" position="left">
      <DuCheckbox v-for="item in items" :key="item" :value="item" :label="item"  />
    </DuCheckboxGroup>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuCheckboxGroup, DuCheckbox } from 'dumpling'

const checked = ref(false)

const checkedItems = ref(['苹果'])
const items = ['苹果', '香蕉', '梨子']
</script>
