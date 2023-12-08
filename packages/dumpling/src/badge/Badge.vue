<template>
  <div class="du-badge" :style="style">
    <slot></slot>
    <div
      v-if="displayText || alwaysShow"
      :class="['du-badge__dot', !dot && `du-badge__dot--with-count`]"
    >
      {{ dot ? '' : value }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
    /**
     * 是否只显示小圆点
     */
    dot: boolean
    /**
     * 如果为数字 0 或者空字符的时候会隐藏红点
     */
    value: string | number
    /**
     * 如果传入的 value 是数字，超过 max 会显示 {max}+
     */
    max?: number
    /**
     * 总是显示
     */
    alwaysShow: boolean
  }>(),
  {
    color: 'error',
    dot: false,
    value: '',
    max: undefined,
    alwaysShow: false,
  },
)

const displayText = computed(() => {
  if (typeof props.value === 'number') {
    if (props.value === 0) {
      return ''
    }
    if (props.max != null && props.value > props.max) {
      return `${props.max}+`
    }
    return `${props.value}`
  } else {
    return props.value
  }
})

const style = computed(() => {
  if (props.color.startsWith('#')) {
    return {
      '--du-c-badge-color': props.color,
    }
  }
  return {
    '--du-c-badge-color': `var(--du-c-${props.color})`,
  }
})
</script>
