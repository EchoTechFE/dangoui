<template>
  <DuCard class="important-mt-4px" title="创建商品" guide-text="">
    <DuForm label-size="80px">
      <DuFormItem label="退货原因" required>
        <DuSelect :options="options" v-model:value="value" />
      </DuFormItem>
    </DuForm>
  </DuCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuSelect, DuButton, DuCard, DuForm, DuFormItem } from 'dangoui'

const open = ref(false)

const value = ref(null)

const options = [
  { label: '商品质量问题', value: 'a' },
  { label: '尺寸/容量与商品描述不符', value: 'b' },
  { label: '卖家发错货', value: 'c' },
  { label: '收到商品少件或破损', value: 'd', disabled: true },
  { label: '其他原因', value: 'e' },
]

function handleOpen() {
  open.value = true
}
</script>
