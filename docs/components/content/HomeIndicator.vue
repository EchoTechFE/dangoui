<template>
  <div class="relative flex flex-col items-center justify-end h-[34px]">
    <!-- End hint divider (optional) -->
    <div v-if="showEndHint" class="flex items-center gap-3 w-full max-w-[355px] mb-4">
      <div
        class="flex-1 h-px"
        :class="theme === 'dark'
          ? 'bg-gradient-to-r from-transparent via-black/8 to-transparent'
          : 'bg-gradient-to-r from-transparent via-white/12 to-transparent'"
      />
      <span
        class="text-[12px]"
        :class="theme === 'dark' ? 'text-black/40' : 'text-white/40'"
      >
        已经到底了
      </span>
      <div
        class="flex-1 h-px"
        :class="theme === 'dark'
          ? 'bg-gradient-to-l from-transparent via-black/8 to-transparent'
          : 'bg-gradient-to-l from-transparent via-white/12 to-transparent'"
      />
    </div>

    <!-- Home Indicator Bar -->
    <div
      class="w-[134px] h-[5px] rounded-full"
      :class="theme === 'dark' ? 'bg-black/24' : 'bg-white/24'"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  theme?: 'dark' | 'white'
  showEndHint?: boolean
}>(), {
  theme: 'dark',
  showEndHint: false,
})
</script>
