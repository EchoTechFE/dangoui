
<template>
  <PreviewBlock title="secondary">
    <div class="flex flex-col gap-y-8px">
      <DuRadioGroup color="secondary" v-model:value="selected" inline>
        <DuRadio v-for="item in items" :label="item" :value="item" />
      </DuRadioGroup>
      <DuRadioGroup color="secondary" v-model:value="selected" inline shape="button">
        <DuRadio v-for="item in items" :label="item" :value="item" />
      </DuRadioGroup>
    </div>
  </PreviewBlock>
  <PreviewBlock title="success">
    <div class="flex flex-col gap-y-8px">
      <DuRadioGroup color="success" v-model:value="selected" inline>
        <DuRadio v-for="item in items" :label="item" :value="item" />
      </DuRadioGroup>
      <DuRadioGroup color="success" v-model:value="selected" inline shape="button">
        <DuRadio v-for="item in items" :label="item" :value="item" />
      </DuRadioGroup>
    </div>
  </PreviewBlock>
  <PreviewBlock title="warning">
    <div class="flex flex-col gap-y-8px">
      <DuRadioGroup color="warning" v-model:value="selected" inline>
        <DuRadio v-for="item in items" :label="item" :value="item" />
      </DuRadioGroup>
      <DuRadioGroup color="warning" v-model:value="selected" inline shape="button">
        <DuRadio v-for="item in items" :label="item" :value="item" />
      </DuRadioGroup>
    </div>
  </PreviewBlock>
  <PreviewBlock title="error">
    <div class="flex flex-col gap-y-8px">
      <DuRadioGroup color="error" v-model:value="selected" inline>
        <DuRadio v-for="item in items" :label="item" :value="item" />
      </DuRadioGroup>
      <DuRadioGroup color="error" v-model:value="selected" inline shape="button">
        <DuRadio v-for="item in items" :label="item" :value="item" />
      </DuRadioGroup>
    </div>
  </PreviewBlock>
  <PreviewBlock title="trade">
    <div class="flex flex-col gap-y-8px">
      <DuRadioGroup color="trade" v-model:value="selected" inline>
        <DuRadio v-for="item in items" :label="item" :value="item" />
      </DuRadioGroup>
      <DuRadioGroup color="trade" v-model:value="selected" inline shape="button">
        <DuRadio v-for="item in items" :label="item" :value="item" />
      </DuRadioGroup>
    </div>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuRadioGroup, DuRadio } from 'dangoui'

const items = ['月卡', '季卡', '年卡']
const selected = ref('')
</script>
