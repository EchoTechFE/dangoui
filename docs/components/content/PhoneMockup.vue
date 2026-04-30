<template>
  <div class="flex justify-center py-10 not-prose">
    <div
      class="relative"
      style="width: 396px; height: 838px; background: #E9E9EF; border-radius: 56px; padding: 0 10.5px 14px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.85), 0 20px 48px rgba(0,0,0,.1);"
    >
      <!-- Dynamic Island (iPhone 14 Pro+) -->
      <div
        v-if="hasDynamicIsland"
        class="absolute left-1/2 -translate-x-1/2 top-12 z-10"
        style="width: 120px; height: 34px; background: #E9E9EF; border-radius: 20px;"
      ></div>

      <!-- Screen -->
      <div
        class="relative overflow-hidden"
        style="width: 375px; height: 812px; border-radius: 46px; background: #fff; margin-top: 12px;"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  hasDynamicIsland?: boolean
}>(), {
  hasDynamicIsland: true,
})
</script>
