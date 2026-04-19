<script setup lang="ts">
// TabsBasic - Tab 按钮组件
defineProps<{
  active?: boolean
}>()
</script>

<template>
  <!-- figma-node: 14205:xxx -->
  <div
    class="flex gap-2 justify-center items-center py-3 px-10 h-30"
    :class="active ? 'c-text-1' : 'c-text-3'"
    @click="$emit('click')"
  >
    <span
      class="text-h4"
      :class="active ? 'fw-500' : 'fw-400'"
    >
      <slot />
    </span>
    <div v-if="active" class="bg-[#2b263b] w-13 h-3 rounded-full" />
  </div>
</template>
