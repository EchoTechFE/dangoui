<script setup lang="ts">
// ButtonIcon - 图标按钮组件
defineProps<{
  label?: string
}>()
</script>

<template>
  <!-- figma-node: 14202:xxx -->
  <div
    class="flex flex-col gap-2 justify-center items-center w-40 h-40"
    @click="$emit('click')"
  >
    <div class="bg-white w-17 h-17" />
    <span v-if="label" class="text-white text-caption">{{ label }}</span>
  </div>
</template>
