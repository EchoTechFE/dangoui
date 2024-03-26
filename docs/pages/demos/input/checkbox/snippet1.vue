
<template>
  <PreviewBlock title="简单例子">
    <DuCheckbox v-model:checked="checked" />

    <DuCheckbox v-model:checked="checked" label="是否公开" position="left" />

    <DuCheckbox v-model:checked="checked" label="是否公开" position="right" />
  </PreviewBlock>
  <PreviewBlock title="Checkbox Group">
    <DuCheckboxGroup v-model:value="checkedItems" position="left">
      <DuCheckbox v-for="item in items" :key="item" :value="item" :label="item"  />
    </DuCheckboxGroup>
  </PreviewBlock>
  <PreviewBlock title="卡片类型">
    <div>
      <DuCheckbox v-model:checked="spuChecked" shape="card">
        <div class="w-81px h-108px object-contain">
          <img src="https://cdn.qiandaoapp.com/interior/images/J3hfXCaguhe3nlHBM0o8vuhslb8nkbVi.png!lfit_w180_png" />
        </div>
      </DuCheckbox>
    </div>

    <div>
      <DuCheckbox v-model:checked="tagChecked" shape="card">
        <div class="w-56px h-56px object-cover">
          <img src="https://cdn.qiandaoapp.com/treasure/images/uxaghFufnnoainMavlsnoDnqWnM07afZ.png!lfit_w180_png" />
        </div>
      </DuCheckbox>
    </div>
  </PreviewBlock>
  <PreviewBlock title="卡片类型（配置 Checkbox Group）">
    <DuCheckboxGroup v-model:value="checkedItems" position="right" inline shape="card">
      <DuCheckbox v-for="item in items" :key="item" :value="item" :label="item" />
    </DuCheckboxGroup>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuCheckboxGroup, DuCheckbox } from '@echofe/dumpling'

const checked = ref(false)

const checkedItems = ref(['🍎'])
const items = ['🍎', '🍌', '🍐']

const spuChecked = ref(true)

const tagChecked = ref(true)

const checkedSpus = ref(['梅'])

const spus = [
  { label: '梅', value: '梅', img: 'https://cdn.qiandaoapp.com/interior/images/J3hfXCaguhe3nlHBM0o8vuhslb8nkbVi.png!lfit_w900_png' },
  { label: '庭·怀静', value: '庭·怀静', img: 'https://cdn.qiandaoapp.com/interior/images/paegg6iRHiunUQzckVX3kmqJ2iwownCO.png!lfit_w900_png' },
  { label: '春·萌生', value: '春·萌生', img: 'https://cdn.qiandaoapp.com/interior/images/bjha0lIiLnqgFnvTPRnfbsnigpjvtezF.png!lfit_w900_png'},
  { label: '竹·入墨', value: '竹·入墨', img: 'https://cdn.qiandaoapp.com/interior/images/nXeiuoOikFgusbeaWylrehwKGiJoiKeq.png!lfit_w900_png'}
]
</script>
