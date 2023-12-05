<template>
  <div :class="className" :style="style">
    <img :src="src" :mode="mode" class="du-image__image" :style="imageStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import classNames from 'classnames'
import styleToCss from 'style-object-to-css-string'

const props = withDefaults(
  defineProps<{
    /**
     * src
     */
    src: string
    /**
     * 自定义 class
     */
    extClass?: string | string[] | Record<string, boolean>
    /**
     * 自定义 style
     */
    extStyle: string | Record<string, string | number>
    mode: 'aspectFit' | 'aspectFill' | 'widthFix'
  }>(),
  {
    mode: 'aspectFill',
    extStyle: '',
  },
)

const className = computed(() => {
  return classNames(['du-image'], props.extClass)
})

const imageStyle = computed(() => {
  // @ts-ignore
  if (typeof uni === 'undefined') {
    switch (props.mode) {
      case 'aspectFit':
        return {
          objectFit: 'contain' as const,
        }
      case 'aspectFill':
        return {
          objectFit: 'cover' as const,
        }
      default:
        return {}
    }
  }
  return {}
})

const style = computed(() => {
  const { extStyle } = props

  return typeof extStyle === 'string'
    ? extStyle
    : styleToCss({
        ...extStyle,
      })
})
</script>
