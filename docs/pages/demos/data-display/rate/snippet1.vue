
<template>
  <PreviewBlock title="不同大小" >
    <div>
      <DuRate
        size="large"
        :count="7"
        :value="5.3"
      />
      <DuRate
        size="medium"
      />
      <DuRate
        size="small"
      />
      <DuRate
        size="mini"
      />
    </div>
  </PreviewBlock>
  <PreviewBlock title="改变值" >
    <DuRate
      size="medium"
      :value="value"
      @update:value="handleUpdate"
    />
  </PreviewBlock>

  <PreviewBlock title="动画效果 - bounce">
    <DuRate
      size="large"
      animation="bounce"
      :defaultValue="3"
    />
  </PreviewBlock>
  <PreviewBlock title="自定义图标" >
    <DuRate
      size="large"
      :defaultValue="3.7"
      icon="like-normal"
    />
  </PreviewBlock>
    <PreviewBlock title="支持半选" >
    <DuRate
      size="large"
      v-model:value="percentValue"
      icon="like-normal"
      half
    />
  </PreviewBlock>
  <PreviewBlock title="带文字" >
    <DuRate
      size="large"
      icon="like-normal"
      half
      withText
      :text-list="[ '丑', '难看', '还行', '不错', '绝美']"
      :defaultValue="3"
    />
  </PreviewBlock>
   <PreviewBlock title="非受控" >
    <DuRate
      size="large"
      icon="like-normal"
      half
      :defaultValue="3"
    />
  </PreviewBlock>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { DuRate } from 'dangoui'

const value = ref(1.5)
const percentValue = ref(1.5)

watch(percentValue, (v) => {
  console.log(v)
})

function handleUpdate(v: number) {
  value.value = v
}

</script>
