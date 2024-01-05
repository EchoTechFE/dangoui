
<template>
  <PreviewBlock title="Large Size" >
    <du-rate 
      size="large"
      :count="7"
      :value="5.3"
    />
  </PreviewBlock>
  <PreviewBlock title="Medium Size" >
    <du-rate 
      size="medium"
    />
  </PreviewBlock>
  <PreviewBlock title="Small Size" >
    <du-rate 
      size="small"
    />
  </PreviewBlock>
  <PreviewBlock title="Mini Size" >
    <du-rate 
      size="mini"
    />
  </PreviewBlock>
  <PreviewBlock title="Disabled" >
    <du-rate 
      size="medium"
      disabled
    />
  </PreviewBlock>
   <PreviewBlock title="Readonly" >
    <du-rate 
      size="medium"
      readonly
    />
  </PreviewBlock>
  <PreviewBlock title="v-modal:value 语法糖" >
    <du-rate 
      size="medium"
      v-model:value="modelValue"
    />
  </PreviewBlock>
  <PreviewBlock title="change" >
    <du-rate 
      size="medium"
      :value="changeValue"
      @change="handleChange"
    />
  </PreviewBlock>
  <PreviewBlock title="animation: fade" >
    <du-rate 
      size="large"
      animation="fade"
    />
  </PreviewBlock>
  <PreviewBlock title="自定义图标" >
    <du-rate 
      size="large"
      :defaultValue="3.7"
      icon="like-normal"
    />
  </PreviewBlock>
    <PreviewBlock title="支持半选" >
    <du-rate 
      size="large"
      v-model:value="percentValue"
      icon="like-normal"
      half
    />
  </PreviewBlock>
   <PreviewBlock title="默认值" >
    <du-rate 
      size="large"
      v-model:value="percentValue"
      icon="like-normal"
      half
      defaultValue="3"
    />
  </PreviewBlock>
   <PreviewBlock title="受控2" >
    <du-rate 
      size="large"
      :value="controledValue"
      icon="like-normal"
      half
    />
  
  </PreviewBlock>
   <PreviewBlock title="非受控" >
    <du-rate 
      size="large"
      icon="like-normal"
      half
      defaultValue="3"
    />
  
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { DuRate, DuIcon } from '@frontend/dumpling'
const modelValue = ref(1.8)
const changeValue = ref(1.5)
const percentValue = ref(1.5)
const controledValue = ref(3)

watch(modelValue, (v) => {
  console.log(v)
})

watch(percentValue, (v) => {
  console.log(v)
})

function handleChange(e) {
  changeValue.value = e.value
}

</script>
