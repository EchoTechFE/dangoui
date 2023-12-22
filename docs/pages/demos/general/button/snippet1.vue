
<template>
  <PreviewBlock title="按钮类型">
    <DuButton type="primary" @click="onClick">
      Primary
    </DuButton>
    <DuButton type="secondary" @click="onClick">
      Secondary
    </DuButton>
    <DuButton type="outline" @click="onClick">
      Outline
    </DuButton>
    <DuButton type="text" @click="onClick">
      Text
    </DuButton>
  </PreviewBlock>
  <PreviewBlock title="按钮大小">
    <DuButton size="mini" @click="onClick">
      Mini
    </DuButton>
    <DuButton size="small" @click="onClick">
      Small
    </DuButton>
    <DuButton size="normal" @click="onClick">
      Normal
    </DuButton>
    <DuButton size="medium" @click="onClick">
      Medium
    </DuButton>
    <DuButton size="large" @click="onClick">
      Large
    </DuButton>
  </PreviewBlock>
  <PreviewBlock title="加载态/禁用态">
    <DuButton loading>
      加载中...
    </DuButton>
    <DuButton disabled disabled-type="default">
      永久禁用
    </DuButton>
    <DuButton disabled disabled-type="temp">
      短暂不可用
    </DuButton>
  </PreviewBlock>
  <PreviewBlock title="带图标">
    <DuButton icon="alarm-filled" type="secondary">
      提醒我
    </DuButton>
    <DuButton arrow-right>去发帖</DuButton>
    <DuButton type="outline" icon="wifi" icon-position="right">
      连接 Wifi
    </DuButton>
  </PreviewBlock>
  <PreviewBlock title="全宽">
    <DuButton class="w-full" type="secondary" full>
      占据剩余空间
    </DuButton>
    <div class="w-full flex gap-x-8px">
      <DuButton class="w-full" type="outline" full>
        取消
      </DuButton>
      <DuButton class="w-full" full>
        确认
      </DuButton>
    </div>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuButton } from '@frontend/dumpling'

function onClick() {
  console.log('[demo] button clicked')
}
</script>
