<template>
  <div
    :class="[
      'du-checkbox__checkbox',
      `du-c-${props.color}-checkbox`,
      selected ? `du-checkbox__checkbox--selected` : '',
      `du-checkbox__checkbox--${shape}`,
    ]"
    :style="{
      width: size,
      height: size,
      border,
    }"
  >
    <div class="du-checkbox__icon">
      <DuIcon v-if="selected" name="check-heavy" :size="size" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DuIcon from '../icon/Icon.vue'
import { useSize } from '../composables/useSize'

const props = withDefaults(
  defineProps<{
    selected: boolean
    shape: string
    size: string | number
    border: string
    color: string
  }>(),
  {
    selected: false,
    shape: 'round',
    size: 20,
    border: '',
    color: 'primary',
  },
)

const size = useSize(() => props.size)
</script>
