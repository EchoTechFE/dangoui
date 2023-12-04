<template>
  <div>switch</div>
</template>

<script setup lang="ts">
defineProps<{
  value: boolean
  disabled: boolean
}>()

defineEmits<{
  (e: 'update:value', on: boolean): void
}>()
</script>
