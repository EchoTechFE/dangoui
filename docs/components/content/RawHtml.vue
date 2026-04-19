<template>
  <div class="not-prose" v-html="html"></div>
</template>

<script setup lang="ts">
defineProps<{
  html: string
}>()
</script>
