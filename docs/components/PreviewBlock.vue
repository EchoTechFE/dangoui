<template>
  <div class="preview-section">
    <div
      v-if="title"
      class="preview-section-title"
    >
      {{ title }}
    </div>
    <div
      :class="[
        showSection ? 'preview-items px-12px py-10px' : '',
        type,
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const { title, showSection, type } = withDefaults(
  defineProps<{
    title: string
    showSection: boolean
    type: 'flex' | 'block'
  }>(),
  {
    title: '',
    showSection: true,
    type: 'flex',
  },
)
</script>

<style scoped>
.preview-section {
  margin-bottom: 20px;
}
.preview-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 8px;
}
</style>
