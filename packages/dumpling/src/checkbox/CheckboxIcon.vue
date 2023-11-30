<template>
  <div
    :class="[
      'du-checkbox__checkbox',
      selected ? `du-checkbox__checkbox--selected` : '',
      `du-checkbox__checkbox--${shape}`,
    ]"
    :style="{
      width: size,
      height: size,
      border,
    }"
  >
    <img
      v-if="selected"
      :style="imageStyle"
      src="https://cdn.qiandaoapp.com/admins/1094c5afbcb6ae86323605a326536769.svg"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    selected: boolean
    shape: string
    size: string
    border: string
  }>(),
  {
    selected: false,
    shape: 'round',
    size: '20px',
    border: '',
  },
)

const imageStyle = computed(() => {
  const { size } = props

  return {
    width: size,
    height: size,
  }
})
</script>
