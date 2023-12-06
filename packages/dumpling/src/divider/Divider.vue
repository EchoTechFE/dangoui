<template>
  <div :class="['du-divider', `du-divider--${config.type}`]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { TabsInjectionKey } from '../tabs/helpers'

const tabsConfig = inject(TabsInjectionKey)

const config = computed(() => {
  return {
    type: tabsConfig ? 'vertical' : 'horizontal',
  }
})
</script>
