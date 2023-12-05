
<template>
  <PreviewBlock title="基本">
    <DuUpload v-model:value="fileList" badge="封面" />
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuUpload } from '@frontend/dumpling'

const fileList = ref([
  {
    uid: 1,
    url: '',
    thumbUrl: 'https://cdn.qiandaoapp.com/interior/images/1ab88333caa868a7f2bdfc0bbd3df1f6.jpg'
  },
])
</script>
