<template>
  <PreviewBlock title="简单">
    <DuSwitch v-model:on="isOn" />
  </PreviewBlock>
  <PreviewBlock title="禁用">
    <DuSwitch v-model:on="isOn" disabled />
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuSwitch } from 'dangoui'

const isOn = ref(false)
</script>
