
<template>
  <PreviewBlock title="Checkbox Group">
    <DuCheckboxGroup v-model:value="checkedItems" position="left">
      <DuCheckbox v-for="item in items" :key="item" :value="item" :label="item"  />
    </DuCheckboxGroup>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuCheckboxGroup, DuCheckbox } from '@echotechfe/dumpling'

const checked = ref(false)

const checkedItems = ref(['苹果'])
const items = ['苹果', '香蕉', '梨子']
</script>
