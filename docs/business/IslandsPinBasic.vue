<script setup lang="ts">
// IslandsPinBasic - 底部 TabBar 单项组件
import { DuIcon, DuBadge } from 'dangoui'

defineProps<{
  name?: string
  icon?: string
  active?: boolean
  badge?: number | string
}>()
</script>

<template>
  <!-- figma-node: 14202:714253 -->
  <div
    class="flex flex-col gap-2 items-center w-17 h-21 py-2 px-3 relative"
    :class="active ? 'c-primary' : 'c-text-3'"
  >
    <!-- Badge -->
    <DuBadge
      v-if="badge"
      :content="badge"
      class="absolute top-6 right-8"
      :max="999"
    />

    <!-- Icon -->
    <div class="w-12 h-12 bg-hex-cccccc rounded-full overflow-hidden">
      <DuIcon v-if="icon" :name="icon" :size="16" />
    </div>

    <!-- Tab name -->
    <span class="text-b6">{{ name }}</span>
  </div>
</template>
