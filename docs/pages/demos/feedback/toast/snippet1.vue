
<template>
  <PreviewBlock>
    <DuButton @click="showToast">打开通知</DuButton>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { DuToastProvider, useToast, DuButton } from 'dangoui'

const { show } = useToast()

function showToast() {
  show({
    message: '测试消息'
  })
}
</script>
