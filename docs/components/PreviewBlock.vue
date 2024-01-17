<template>
  <div class="mb-8px">
    <div class="px-8px text-14px fw-400 py-4px c-slate-500">{{ title }}</div>
    <div
      :class="[
        showSection ? 'py-16px flex-wrap gap-x-8px gap-y-16px' : '',
        type,
        globalTheme.endsWith('dark')
          ? 'bg-hex-101010 rd-8px mx-4px px-8px'
          : 'bg-white rd-8px mx-4px px-8px',
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
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
