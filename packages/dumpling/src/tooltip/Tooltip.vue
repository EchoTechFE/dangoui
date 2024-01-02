<template>
  <div class="du-tooltip">
    <slot />
    <div class="du-tooltip__popover">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
  }>(),
  {
    title: '',
  },
)
</script>
