<template>
  <div :class="className" :style="style">
    <DuImage v-if="src" :src="src" mode="aspectFill" :width="width" :height="width" />
    <div v-else class="du-avatar__fallback">
      <slot />
    </div>
    <div v-if="bordered" class="du-avatar__border" :class="`du-avatar__border--${type}`"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, normalizeStyle, normalizeClass } from 'vue'

import DuImage from '../image/Image.vue'
import { getWidth } from './helper'

const props = withDefaults(
  defineProps<{
    /**
     * src
     */
    src: string
    /**
     * 头像类型
     */
    type: 'primary' | 'trade' | 'success' | 'error' | 'default' | 'white'
    /**
     * 头像大小
     */
    size: 'mini' | 'small' | 'normal' | 'medium' | 'large'
    /**
     * 是否展示外边框
     */
    bordered: boolean
    /**
     * 自定义 class
     */
    extClass?: string | string[] | Record<string, boolean>
    /**
     * 自定义 style
     */
    extStyle?:
      | string
      | {
          [x: string]: string | number
        }
  }>(),
  {
    size: 'normal',
    type: 'default',
    bordered: false,
    extClass: '',
    extStyle: '',
  },
)

const className = computed(() => {
  const { size, extClass } = props

  return normalizeClass(['du-avatar', `du-avatar--${size}`, extClass])
})

const style = computed(() => {
  const { extStyle } = props

  return normalizeStyle(extStyle)
})

const width = computed(() => {
  return getWidth(props.size)
})
</script>
