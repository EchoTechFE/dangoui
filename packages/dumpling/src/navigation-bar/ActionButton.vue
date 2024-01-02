<template>
  <button class="du-action-button" @click="handleClick">
    <DuIcon :name="name" />
  </button>
</template>

<script setup lang="ts">
import DuIcon from '../icon/Icon.vue'

defineProps<{
  color: 'black' | 'white'
  name: string
}>()

const emit = defineEmits<{
  (evt: 'click'): void
}>()

function handleClick() {
  emit('click')
}
</script>
