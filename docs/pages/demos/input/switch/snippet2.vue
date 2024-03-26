<template>
  <PreviewBlock title="secondary">
    <DuSwitch v-model:on="isOn" color="secondary" />
    <DuSwitch v-model:on="isOn" color="secondary" disabled />
  </PreviewBlock>
  <PreviewBlock title="success">
    <DuSwitch v-model:on="isOn" color="success" />
    <DuSwitch v-model:on="isOn" color="success" disabled />
  </PreviewBlock>
  <PreviewBlock title="warning">
    <DuSwitch v-model:on="isOn" color="warning" />
    <DuSwitch v-model:on="isOn" color="warning" disabled />
  </PreviewBlock>
  <PreviewBlock title="error">
    <DuSwitch v-model:on="isOn" color="error" />
    <DuSwitch v-model:on="isOn" color="error" disabled />
  </PreviewBlock>
  <PreviewBlock title="trade">
    <DuSwitch v-model:on="isOn" color="trade" />
    <DuSwitch v-model:on="isOn" color="trade" disabled />
  </PreviewBlock>
  <PreviewBlock title="default">
    <DuSwitch v-model:on="isOn" color="default" />
    <DuSwitch v-model:on="isOn" color="default" disabled />
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuSwitch } from 'dangoui'

const isOn = ref(false)
</script>
