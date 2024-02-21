
<template>
  <PreviewBlock title="基本">
    <DuButton @click="handleOpen">打开选择器</DuButton>
    <DuPicker title="请选择时间" v-model:open="open" :columns="columns" :value="value" @update:value="handleUpdate" />
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuPicker, DuButton } from '@frontend/dumpling'
import { ref } from 'vue'

const value = ref([])
const open = ref(false)

const columns = [
  [
    { label: '周一', value: ' 1' },
    { label: '周二', value: '2' },
    { label: '周三', value: '3' },
    { label: '周四', value: '4' },
    { label: '周五', value: '5' },
    { label: '周六', value: '6' },
    { label: '周日', value: '7' },
  ],
  [
    { label: ' 上午', value: 'am' },
    { label: '下午', value: 'pm' },
  ],
]

function handleUpdate(v) {
  console.log(`[demo] ${v.join('/')}`)
  value.value = v
}

function handleOpen() {
  open.value = true
}
</script>
