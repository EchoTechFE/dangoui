
<template>
  <DuGroupCell class="important-mt-4px" title="创建商品" guide-text="">
    <DuForm label-size="80px">
      <DuFormItem label="商品名称" required>
        <DuCascader :options="options" v-model:value="value" />
      </DuFormItem>
    </DuForm>
  </DuGroupCell>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuCascader, DuButton, DuForm, DuFormItem, DuGroupCell } from '@frontend/dumpling'

const value = ref<string[]>([])
const open = ref(false)

function handleOpen() {
  open.value = true
}

const options = [
  {
    label: '上海',
    value: '上海',
    children: [
      {
        label: '上海',
        value: '上海',
        children: [
          {
            label: '黄浦区',
            value: '黄浦区'
          },
          {
            label: '徐汇区',
            value: '徐汇区'
          },
          {
            label: '长宁区',
            value: '长宁区'
          },
          {
            label: '普陀区',
            value: '普陀区'
          },
          {
            label: '静安区',
            value: '静安区'
          },
          {
            label: '虹口区',
            value: '虹口区'
          },
          {
            label: '杨浦区',
            value: '杨浦区'
          },
        ]
      }
    ]
  },
  {
    label: '浙江',
    value: '浙江',
    children: [
      {
        label: '温州',
        value: '温州',
        children: [
          {
            label: '鹿城区',
            value: '鹿城区'
          },
          {
            label: '龙湾区',
            value: '龙湾区'
          },
          {
            label: '瓯海区',
            value: '瓯海区'
          },
          {
            label: '洞头区',
            value: '洞头区'
          },
          {
            label: '永嘉县',
            value: '永嘉县'
          },
          {
            label: '苍南县',
            value: '苍南县'
          },
          {
            label: '平阳县',
            value: '平阳县'
          },
          {
            label: '泰顺县',
            value: '泰顺县'
          },
          {
            label: '文成县',
            value: '文成县'
          },
          {
            label: '瑞安市',
            value: '瑞安市'
          },
          {
            label: '乐清市',
            value: '乐清市'
          },
          {
            label: '龙港市',
            value: '龙港市'
          },
        ]
      }
    ]
  },
]
</script>
