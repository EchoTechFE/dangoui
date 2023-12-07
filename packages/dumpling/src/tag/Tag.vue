<template>
  <div
    :class="[
      'du-tag',
      `du-tag--${colorName}`,
      `du-tag--${size}`,
      {
        'du-tag--ghost': ghost,
        'du-tag--bordered': bordered,
      },
    ]"
    :style="{
      color: textColor,
      borderColor: borderColor,
      backgroundColor: backgroundColor,
    }"
    @click="handleClick"
  >
    <div v-if="icon" :class="`du-tag__icon du-tag__icon--${size}`">
      <DuIcon :name="icon" />
    </div>
    <slot />
    <div
      v-if="closeable"
      :class="`du-tag__close du-tag__close--${size}`"
      @click.stop="handleClose"
    >
      <DuIcon name="close-circle-filled" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DuIcon from '../icon/Icon.vue'

const props = withDefaults(
  defineProps<{
    color:
      | 'primary'
      | 'secondary'
      | 'success'
      | 'warning'
      | 'error'
      | 'default'
      | `#${string}`
      | { border: string; text: string; background: string }
    round: boolean
    bordered: boolean
    ghost: boolean
    size: 'mini' | 'small' | 'medium' | 'large'
    closeable: boolean
    icon?: string
  }>(),
  {
    color: 'primary',
    round: false,
    bordered: false,
    ghost: false,
    size: 'medium',
    closeable: false,
  },
)

const colorName = computed(() => {
  if (typeof props.color === 'string') {
    if (props.color.startsWith('#')) {
      return 'primary'
    }
    return props.color
  } else {
    return props.color
  }
})

const textColor = computed(() => {
  if (typeof props.color === 'string') {
    if (props.color.startsWith('#')) {
      return props.color
    }
  } else {
    return props.color.text
  }
})

const borderColor = computed(() => {
  if (!props.bordered) {
    return undefined
  }

  if (typeof props.color === 'string') {
    if (props.color.startsWith('#')) {
      return props.color
    }
  } else {
    return props.color.border
  }
})

const backgroundColor = computed(() => {
  if (props.ghost) {
    return undefined
  }

  if (typeof props.color === 'string') {
    if (props.color.startsWith('#') && props.color.length === 7) {
      return props.color + '33'
    }
  } else {
    return props.color.background
  }
})

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'close'): void
}>()

function handleClose() {
  emit('close')
}

function handleClick() {
  emit('click')
}
</script>
