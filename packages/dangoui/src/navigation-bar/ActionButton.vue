<template>
  <button class="du-action-button" @click="handleClick">
    <DuIcon :unsafe-internal="name" />
  </button>
</template>

<script setup lang="ts">
import DuIcon from '../icon/Icon.vue'

defineProps<{
  color: 'black' | 'white'
  name: string | { _: string }
}>()

const emit = defineEmits<{
  (evt: 'click', event: any): void
}>()

function handleClick(event: any) {
  emit('click', event)
}
</script>
