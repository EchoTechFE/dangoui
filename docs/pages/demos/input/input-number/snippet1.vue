
<template>
  <PreviewBlock title="基本">
    <InputNumber :min="0" :max="6" highlight-add @change="handleChange" />
  </PreviewBlock>
  <PreviewBlock title="可以手动输入数字">
    <InputNumber input :max="100" @change="handleChange" />
  </PreviewBlock>
  <PreviewBlock title="允许小数点">
    <InputNumber input v-model:value="value" :max="100" allow-decimal @change="handleChange" />
  </PreviewBlock>
  <PreviewBlock title="步长">
    <InputNumber :step="2" :max="100" @change="handleChange" />
  </PreviewBlock>
  <PreviewBlock title="禁用">
    <InputNumber input size="mini" disabled />
  </PreviewBlock>
  <PreviewBlock title="不同大小">
    <InputNumber input size="mini" />
    <InputNumber input size="small" />
    <InputNumber input size="normal" />
    <InputNumber input size="medium" />
    <InputNumber input size="large" />
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { InputNumber } from '@frontend/dumpling'

const value = ref(0)

watch(value, (val) => {
  console.log(`[demo] value changed: ${val}, typeof value ${typeof val}`)
})

function handleChange(v: number) {
  console.log(`[demo] ${v}`)
}
</script>
