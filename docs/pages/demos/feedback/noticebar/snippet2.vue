
<template>
  <PreviewBlock title="默认">
    <div class="flex-auto">
      <DuNoticeBar
        text="购买后暂存商家寄存柜，可累计发货省运费"
        link-text="如何发货"
        link-icon="question-circle-filled"
      />
    </div>
  </PreviewBlock>
  <PreviewBlock title="成功">
    <div class="flex-auto">
      <DuNoticeBar
        color="success"
        text="购买后暂存商家寄存柜，可累计发货省运费"
        link-text="如何发货"
        link-icon="question-circle-filled"
      />
    </div>
  </PreviewBlock>
  <PreviewBlock title="警告">
    <div class="flex-auto">
      <DuNoticeBar
        color="warning"
        text="购买后暂存商家寄存柜，可累计发货省运费"
        link-text="如何发货"
        link-icon="question-circle-filled"
      />
    </div>
  </PreviewBlock>
  <PreviewBlock title="失败">
    <div class="flex-auto">
      <DuNoticeBar
        color="error"
        text="购买后暂存商家寄存柜，可累计发货省运费"
        link-text="如何发货"
        link-icon="question-circle-filled"
      />
    </div>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuNoticeBar } from '@echotechfe/dumpling'
</script>
