
<template>
  <PreviewBlock title="基本">
    <DuUpload
      v-model:value="fileList"
      badge="封面"
      action="https://run.mocky.io/v3/de7ed31f-93f1-4143-b25e-c9249cd77a5c"
      :before-response="beforeResponse"
      :media-type="['image']"
      :max-count="6"
    />
  </PreviewBlock>
  <PreviewBlock title="初始">
    <DuUpload
      v-model:value="fileList3"
      action="https://run.mocky.io/v3/de7ed31f-93f1-4143-b25e-c9249cd77a5c"
      :before-response="beforeResponse"
    />
  </PreviewBlock>
  <PreviewBlock title="改变大小">
    <DuUpload
      v-model:value="fileList2"
      size="large"
      action="https://run.mocky.io/v3/de7ed31f-93f1-4143-b25e-c9249cd77a5c"
      :before-response="beforeResponse"
    />
  </PreviewBlock>
  <PreviewBlock title="禁用">
    <DuUpload
      v-model:value="fileList2"
      badge="封面"
      action="https://run.mocky.io/v3/de7ed31f-93f1-4143-b25e-c9249cd77a5c"
      :before-response="beforeResponse"
      disabled
    />
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuUpload } from 'dangoui'

function beforeResponse(f: any) {
  if (f.statusCode === 200) {
    const json = JSON.parse(f.responseText)
    f.url = json.url
    f.thumbUrl = json.url
    f.status = 'done'
  } else {
    f.status = 'error'
  }

  f.chain = false

  return f
}

const fileList = ref([
  {
    uid: 1,
    url: '',
    thumbUrl: 'https://cdn.qiandaoapp.com/interior/images/1ab88333caa868a7f2bdfc0bbd3df1f6.jpg'
  },
  {
    uid: 2,
    url: '',
    thumbUrl: 'https://cdn.qiandaoapp.com/interior/images/1ab88333caa868a7f2bdfc0bbd3df1f6.jpg'
  },
  {
    uid: 3,
    url: '',
    thumbUrl: 'https://cdn.qiandaoapp.com/interior/images/1ab88333caa868a7f2bdfc0bbd3df1f6.jpg'
  },
  {
    uid: 4,
    url: '',
    thumbUrl: 'https://cdn.qiandaoapp.com/interior/images/1ab88333caa868a7f2bdfc0bbd3df1f6.jpg'
  },
  {
    uid: 5,
    url: '',
    thumbUrl: 'https://cdn.qiandaoapp.com/interior/images/1ab88333caa868a7f2bdfc0bbd3df1f6.jpg'
  }
])

const fileList2 = ref([
  {
    uid: 1,
    url: '',
    thumbUrl: 'https://cdn.qiandaoapp.com/interior/images/1ab88333caa868a7f2bdfc0bbd3df1f6.jpg'
  },
  {
    uid: 2,
    url: '',
    thumbUrl: 'https://cdn.qiandaoapp.com/interior/images/1ab88333caa868a7f2bdfc0bbd3df1f6.jpg'
  },
])

const fileList3 = ref([])
</script>
