
<template>
  <PreviewBlock title="切换主题">
    <DuTheme :name="theme">
      <DuRadioGroup v-model:value="theme">
        <DuRadio label="千岛" value="qd" />
        <DuRadio label="奇货" value="qh" />
        <DuRadio label="商家助手" value="qdm" />
        <DuRadio label="米花星球" value="mihua-light" />
      </DuRadioGroup>
      <div class="flex flex-col gap-8px mt-16px">
        <DuButton color="primary">选择我的兴趣</DuButton>
        <DuSwitch color="primary" on />
        <DuSwitch color="primary" on disabled />
        <DuButton color="success">完成</DuButton>
        <DuSwitch color="success" on />
      </div>
    </DuTheme>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuButton, DuSwitch, DuTheme, DuRadio, DuRadioGroup } from '@echotechfe/dumpling'

const theme = ref('qd')
</script>
