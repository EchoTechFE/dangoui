<template>
  <div class="preview-section">
    <div
      v-if="title"
      class="w-full text-11px font-600 uppercase tracking-[0.8px] text-[var(--doc-text-tertiary)] bg-[var(--doc-bg-secondary)] px-14px py-14px border-b border-b-solid border-b-[var(--doc-border-light)]"
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
