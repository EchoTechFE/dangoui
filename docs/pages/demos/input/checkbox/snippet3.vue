
<template>
  <PreviewBlock title="secondary">
    <DuCheckboxGroup color="secondary" v-model:value="checkedItems" position="left">
      <DuCheckbox v-for="item in items" :key="item" :value="item" :label="item"  />
    </DuCheckboxGroup>
  </PreviewBlock>
  <PreviewBlock title="success">
    <DuCheckboxGroup color="success" v-model:value="checkedItems" position="left">
      <DuCheckbox v-for="item in items" :key="item" :value="item" :label="item"  />
    </DuCheckboxGroup>
  </PreviewBlock>
  <PreviewBlock title="warning">
    <DuCheckboxGroup color="warning" v-model:value="checkedItems" position="left">
      <DuCheckbox v-for="item in items" :key="item" :value="item" :label="item"  />
    </DuCheckboxGroup>
  </PreviewBlock>
  <PreviewBlock title="error">
    <DuCheckboxGroup color="error" v-model:value="checkedItems" position="left">
      <DuCheckbox v-for="item in items" :key="item" :value="item" :label="item"  />
    </DuCheckboxGroup>
  </PreviewBlock>
  <PreviewBlock title="trade">
    <DuCheckboxGroup color="trade" v-model:value="checkedItems" position="left">
      <DuCheckbox v-for="item in items" :key="item" :value="item" :label="item"  />
    </DuCheckboxGroup>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuCheckboxGroup, DuCheckbox } from 'dangoui'

const checked = ref(false)

const checkedItems = ref(['苹果'])
const items = ['苹果', '香蕉', '梨子']
</script>
