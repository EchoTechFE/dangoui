<template>
  <div :class="className" :style="style" @click="onClick">
    <DuImage
      v-if="src"
      :src="src"
      mode="aspectFill"
      :width="width"
      :height="width"
      radius="50%"
      ext-style="overflow: hidden;"
    />
    <div v-else class="du-avatar__fallback">
      <slot />
    </div>
    <div
      v-if="bordered"
      class="du-avatar__border"
      :class="`du-avatar__border--${type}`"
    ></div>
    <slot name="icon">
      <div v-if="icon" class="du-avatar__icon">
        <DuIcon :name="icon" :color="iconColor" :size="16" />
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, normalizeStyle, normalizeClass } from 'vue'

import DuIcon from '../icon/Icon.vue'
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
     * badge
     */
    icon?: string
    iconColor?: string
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
    icon: '',
    extClass: '',
    extStyle: '',
  },
)

const emit = defineEmits<{
  (e: 'click', event: any): void
}>()

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

function onClick(event: any) {
  emit('click', event)
}
</script>
