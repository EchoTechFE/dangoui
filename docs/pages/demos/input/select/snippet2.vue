
<template>
  <PreviewBlock title="单组作为弹出组件">
    <DuButton @click="handleOpen">打开选择</DuButton>
    <DuButton @click="handleOpenWithConfirm">打开带确认按钮的选择</DuButton>
    <div>{{ value }}</div>
    <DuSelect :options="options" v-model:value="value" v-model:open="open" mode="multiple" />
    <DuSelect :options="options" v-model:value="value" v-model:open="openWithConfirm" mode="multiple" with-confirm />
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuSelect, DuButton } from '@frontend/dumpling'

const open = ref(false)
const openWithConfirm = ref(false)

const value = ref([])

const options = [
  { label: '商品质量问题', value: 'a' },
  { label: '尺寸/容量与商品描述不符', value: 'b' },
  { label: '卖家发错货', value: 'c' },
  { label: '收到商品少件或破损', value: 'd', disabled: true },
  { label: '其他原因', value: 'e' }
]

function handleOpen() {
  open.value = true
}

function handleOpenWithConfirm() {
  openWithConfirm.value = true
}
</script>
