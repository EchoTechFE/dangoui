
<template>
  <PreviewBlock title="所有图标">
    <div class="flex-auto">
      <DuSearch class="mb-16px" placeholder="输入名称搜索图标..." v-model:value="keyword" />
      <div class="grid grid-cols-4 gap-x-4px gap-y-8px">
        <div
          v-for="(iconName, idx) in displayIcons"
          :key="idx"
          class="flex flex-col items-center text-neutral-800"
        >
          <DuIcon :name="iconName" :size="32" />
          <div class="mt-4px text-12px line-clamp-3 text-center text-neutral-600">{{ iconName }}</div>
        </div>
      </div>
    </div>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DuIcon, DuSearch } from '@echofe/dumpling'
import iconConfig from '@echofe/dumpling/iconfont-config.json'

const keyword = ref('')

const displayIcons = computed(() => {
  return Object.keys(iconConfig.icons).filter(n => n.includes(keyword.value))
})

</script>
