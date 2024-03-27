
<template>
  <PreviewBlock title="一组值">
    <DuRadioGroup v-model:value="selected">
      <DuRadio v-for="item in items" :label="item" :value="item" />
    </DuRadioGroup>
  </PreviewBlock>
  <PreviewBlock title="显示成一行">
    <DuRadioGroup v-model:value="inlineSelected" inline>
      <DuRadio v-for="item in items" :label="item" :value="item" />
    </DuRadioGroup>
  </PreviewBlock>
  <PreviewBlock title="按钮形状">
    <DuRadioGroup v-model:value="buttonInlineSelected" inline shape="button">
      <DuRadio v-for="item in items" :label="item" :value="item" />
    </DuRadioGroup>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuRadioGroup, DuRadio } from 'dangoui'

const items = ['月卡', '季卡', '年卡']
const selected = ref('')
const inlineSelected = ref('')
const buttonInlineSelected = ref('')
</script>
