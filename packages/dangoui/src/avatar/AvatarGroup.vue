<template>
  <div :style="style" :class="className">
    <DuAvatar
      v-for="(src, index) in displayAvatars"
      :key="src"
      :src="src"
      :type="type"
      :size="size"
      :bordered="bordered"
      :ext-style="{
        marginLeft: index > 0 ? `-${internalGap}px` : 0,
        position: 'relative',
        zIndex: reverse ? index : avatars.length - index,
      }"
    />
    <DuAvatar
      v-if="limit > 0 && avatars.length > limit"
      src=""
      :size="size"
      :type="type"
      :bordered="bordered"
      :ext-style="{
        marginLeft: `-${internalGap}px`,
        position: 'relative',
        zIndex: reverse ? limit + 1 : avatars.length - limit,
      }"
    >
      <span class="du-avatar-group__limit-avatar-text">
        +{{ avatars.length - limit }}
      </span>
    </DuAvatar>
  </div>
</template>

<script setup lang="ts">
import { computed, normalizeStyle, normalizeClass } from 'vue'

import DuAvatar from './Avatar.vue'

const props = withDefaults(
  defineProps<{
    /**
     * 头像文件列表
     */
    avatars: string[]
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
    bordered?: boolean
    /**
     * 头像间距
     */
    gap?: number
    /**
     * 层级是否倒序
     */
    reverse?: boolean
    /**
     * 限制头像数量
     */
    limit?: number
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
    reverse: false,
    limit: 0,
  },
)

const displayAvatars = computed(() => {
  const { limit, avatars } = props

  return limit > 0 ? avatars.slice(0, limit) : avatars
})

const internalGap = computed(() => {
  const { gap } = props
  const { size } = props
  const margin = ['mini', 'small'].includes(size) ? 8 : 12
  return gap ?? margin
})

const className = computed(() => {
  const { size, extClass } = props

  return normalizeClass([
    'du-avatar-group',
    `du-avatar-group--${size}`,
    extClass,
  ])
})

const style = computed(() => {
  const { extStyle } = props

  return normalizeStyle(extStyle)
})
</script>
