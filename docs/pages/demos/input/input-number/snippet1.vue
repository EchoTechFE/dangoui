
<template>
  <PreviewBlock title="基本">
    <DuInputNumber :min="0" :max="6" highlight-add @change="handleChange" />
  </PreviewBlock>
  <PreviewBlock title="紧凑（没有值的时候只显示增加）">
    <DuInputNumber :min="0" :max="6" compact highlight-add @change="handleChange" />
  </PreviewBlock>
  <PreviewBlock title="可以手动输入数字">
    <DuInputNumber input :max="100" @change="handleChange" />
  </PreviewBlock>
  <PreviewBlock title="允许小数点">
    <DuInputNumber input v-model:value="value" :max="100" allow-decimal @change="handleChange" />
  </PreviewBlock>
  <PreviewBlock title="步长">
    <DuInputNumber :step="2" :max="100" @change="handleChange" />
  </PreviewBlock>
  <PreviewBlock title="禁用">
    <DuInputNumber input size="mini" disabled />
  </PreviewBlock>
  <PreviewBlock title="不同大小">
    <DuInputNumber input size="mini" />
    <DuInputNumber input size="small" />
    <DuInputNumber input size="normal" />
    <DuInputNumber input size="medium" />
    <DuInputNumber input size="large" />
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuInputNumber } from '@frontend/dumpling'

const value = ref(0)

watch(value, (val) => {
  console.log(`[demo] value changed: ${val}, typeof value ${typeof val}`)
})

function handleChange(v: number) {
  console.log(`[demo] ${v}`)
}
</script>
