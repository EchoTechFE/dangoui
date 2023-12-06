<template>
  <div
    :class="['du-tag', `du-tag--${color}`, `du-tag--${size}`]"
    @click="handleClick"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    color: string
    round: boolean
    bordered: boolean
    size: 'small' | 'medium' | 'large'
  }>(),
  {
    color: 'primary',
    round: false,
    bordered: false,
    size: 'medium',
  },
)

const emit = defineEmits<{
  (e: 'click'): void
}>()

function handleClick() {
  emit('click')
}
</script>
