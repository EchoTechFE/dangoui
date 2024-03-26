
<template>
  <PreviewBlock title="基本">
    <DuButton @click="singleVisible = true">单个日期选择</DuButton>
    <DuButton @click="multipleVisible = true">选择日期</DuButton>
    <DuButton @click="rangeVisible = true">范围选择</DuButton>
  </PreviewBlock>
  <PreviewBlock title="最小可选时间">
    <DuButton @click="visible4 = true">单个日期选择</DuButton>
  </PreviewBlock>
  <DuCalendar v-model:visible="singleVisible" type="single" @confirm="handleSingleConfirm" />
  <DuCalendar v-model:visible="multipleVisible" type="multiple" @confirm="handleMultipleConfirm" />
  <DuCalendar v-model:visible="rangeVisible" type="range" @confirm="handleRangeConfirm" />
  <DuCalendar v-model:visible="visible4" type="range" :min="minDate" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuButton, DuCalendar } from '@echotechfe/dumpling'
import dayjs from 'dayjs'

const singleVisible = ref(false)
const multipleVisible = ref(false)
const rangeVisible = ref(false)

const minDate = dayjs().subtract(6, 'month')
const visible4 = ref(false)

function handleSingleConfirm({ value }: any) {
  console.log(`[demo] ${value.map(e => e.format('YYYY-MM-DD')).join(', ')}`)
}

function handleMultipleConfirm({ value }: any) {
  console.log(`[demo] ${value.map(e => e.format('YYYY-MM-DD')).join(', ')}`)
}

function handleRangeConfirm({ value }: any) {
  console.log(`[demo] ${value.map(e => e.format('YYYY-MM-DD')).join(', ')}`)
}
</script>
