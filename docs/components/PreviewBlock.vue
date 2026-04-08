<template>
  <div class="mb-8px">
    <div class="px-4px text-12px fw-400 py-4px c-slate-500">{{ title }}</div>
    <div
      :class="[
        showSection ? 'py-8px flex-wrap gap-x-8px gap-y-4px' : '',
        type,
        showSection
          ? globalTheme.endsWith('dark')
            ? 'bg-hex-101010 rd-8px mx-4px px-8px'
            : 'bg-white rd-8px mx-4px px-8px'
          : undefined,
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
