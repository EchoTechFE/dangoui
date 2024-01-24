
<template>
  <DuCard class="important-mt-4px" title="创建商品" guide-text="">
    <DuForm label-size="80px">
      <DuFormItem label="退货原因" required :show-border="false" items="start">
        <DuSelect :options="options" v-model:value="value" mode="multiple" />
      </DuFormItem>
    </DuForm>
  </DuCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuSelect, DuButton, DuCard, DuForm, DuFormItem } from '@frontend/dumpling'

const open = ref(false)

const value = ref(null)

const options = [
  { label: '商品质量问题', value: 'a' },
  { label: '尺寸/容量与商品描述不符', value: 'b' },
  { label: '卖家发错货', value: 'c' },
  { label: '收到商品少件或破损', value: 'd', disabled: true },
  { label: '其他原因', value: 'e' },
  { label: 'x1', value: 'x1' },
  { label: 'x2', value: 'x2' },
  { label: 'x3', value: 'x3' },
  { label: 'x4', value: 'x4' },
  { label: 'x5', value: 'x5' },
  { label: 'x6', value: 'x6' },
  { label: 'x7', value: 'x7' },
  { label: 'x8', value: 'x8' }
]

function handleOpen() {
  open.value = true
}
</script>
