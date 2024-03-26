<template>
  <PreviewBlock title="单独使用">
    <div>
      <DuRadio />
      <DuRadio
        label="季卡"
        :checked="checked"
        @update:value="handleInput"
        @click="handleClick"
      />
    </div>
  </PreviewBlock>
  <PreviewBlock title="按钮形状">
    <div>
      <DuRadio
        shape="button"
        label="月卡"
        :checked="monthlyChecked"
        @update:value="handleMonthlyUpdate"
      />
    </div>
  </PreviewBlock>
  <PreviewBlock title="禁用">
    <div>
      <DuRadio disabled :checked="true" />
      <DuRadio disabled />
    </div>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuRadio } from 'dangoui'

const checked = ref(false)
const monthlyChecked = ref(false)

function handleInput(e: { checked: boolean }) {
  checked.value = e.checked
}

function handleClick() {
  console.log('[demo] radio clicked')
}

function handleMonthlyUpdate(e: { checked: boolean }) {
  monthlyChecked.value = e.checked
}
</script>
