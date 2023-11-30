
<template>
  <PreviewBlock title="基本">
    <DuButton @click="singleVisible = true">单个日期选择</DuButton>
    <DuButton @click="multipleVisible = true">选择日期</DuButton>
    <DuButton @click="rangeVisible = true">范围选择</DuButton>
  </PreviewBlock>
  <DuCalendar v-model:visible="singleVisible" type="single" @confirm="handleSingleConfirm" />
  <DuCalendar v-model:visible="multipleVisible" type="multiple" @confirm="handleMultipleConfirm" />
  <DuCalendar v-model:visible="rangeVisible" type="range" @confirm="handleRangeConfirm" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuButton, DuCalendar } from 'dumpling'

const singleVisible = ref(false)
const multipleVisible = ref(false)
const rangeVisible = ref(false)

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
