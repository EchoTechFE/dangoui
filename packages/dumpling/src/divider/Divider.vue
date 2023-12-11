<template>
  <div :class="['du-divider', `du-divider--${config.type}`]">
    <template v-if="config.type === 'horizontal'">
      <div class="du-divider__left" />
      <div class="du-divider__content">
        <slot />
      </div>
      <div class="du-divider__right" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { dividerInjectionKey } from './helpers'

const props = withDefaults(
  defineProps<{
    type?: 'horizontal' | 'vertical'
  }>(),
  {
    type: undefined,
  },
)

const dividerConfig = inject(dividerInjectionKey)

const config = computed(() => {
  if (props.type) {
    return {
      type: props.type,
    } as const
  }

  return {
    type: dividerConfig?.defaultType || 'horizontal',
  } as const
})
</script>
