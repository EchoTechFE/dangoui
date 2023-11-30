<template>
  <div class="mb-8px">
    <div class="px-8px text-14px fw-400 py-4px c-slate-500">{{ title }}</div>
    <div
      :class="[
        showSection
          ? 'px-8px py-16px flex flex-wrap gap-x-8px gap-y-16px bg-white'
          : '',
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
  }>(),
  {
    title: '',
    showSection: true,
  },
)
</script>
