<template>
  <div
    :class="[
      'du-form-field',
      {
        'du-form-field--placeholder': !text,
      },
    ]"
    @click="handleClick"
  >
    <div>{{ text || placeholder }}</div>
    <div class="du-form-field__icon">
      <DuIcon name="arrow-heavy-right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DuIcon from '../icon/Icon.vue'

defineProps<{
  text: string
  placeholder: string
  arrowRight?: string
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

function handleClick() {
  emit('click')
}
</script>
