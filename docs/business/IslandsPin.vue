<script setup lang="ts">
// IslandsPin - 底部 TabBar 容器组件
import IslandsPinBasic from './IslandsPinBasic.vue'

const props = defineProps<{
  tabs: Array<{
    id: string
    name: string
    icon: string
    badge?: number | string
  }>
}>()

const emit = defineEmits<{
  (e: 'update:activeTab', value: string): void
}>()

const activeTab = ref(props.tabs[0]?.id || 'home')

function handleTabClick(tabId: string) {
  activeTab.value = tabId
  emit('update:activeTab', tabId)
}
</script>

<template>
  <!-- figma-node: 14202:714253 -->
  <div class="flex justify-around items-center bg-white b-t-1 b-t-solid b-hex-E5E5E5 safe-area-bottom">
    <IslandsPinBasic
      v-for="tab in tabs"
      :key="tab.id"
      :name="tab.name"
      :icon="tab.icon"
      :badge="tab.badge"
      :active="activeTab === tab.id"
      @click="handleTabClick(tab.id)"
    />
  </div>
</template>
