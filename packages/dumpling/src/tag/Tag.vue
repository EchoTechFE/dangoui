<template>
  <div
    :class="[
      'du-tag',
      `du-tag--${colorName}`,
      `du-tag--${size}`,
      {
        'du-tag--ghost': ghost,
        'du-tag--bordered': bordered,
        'du-tag--round': round,
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
    /**
     * 颜色，可以使用主题预置的颜色或者十六进制颜色表示，也可以使用对象更灵活地来自定义颜色
     */
    color:
      | 'primary'
      | 'secondary'
      | 'success'
      | 'warning'
      | 'error'
      | 'default'
      | `#${string}`
      | { border: string; text: string; background: string }
    /**
     * 是否为圆角
     */
    round: boolean
    /**
     * 是否带有边框
     */
    bordered: boolean
    /**
     * 是否是透明背景
     */
    ghost: boolean
    /**
     * 大小
     */
    size: 'mini' | 'small' | 'medium' | 'large'
    /**
     * 是否可关闭（显示一个关闭按钮）
     */
    closeable: boolean
    /**
     * 左侧图标
     */
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
