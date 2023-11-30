
<template>
  <PreviewBlock title="所有图标">
    <div class="grid grid-cols-4 gap-x-4px">
      <div
        v-for="(iconName, idx) in Object.keys(iconConfig.icons)"
        :key="idx"
        class="flex flex-col items-center text-neutral-800"
      >
        <DuIcon :name="iconName" size="32px" />
        <div class="text-12px line-clamp-1 text-center">{{ iconName }}</div>
      </div>
    </div>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuIcon } from 'dumpling'
import iconConfig from 'dumpling/iconfont-config.json'
</script>
