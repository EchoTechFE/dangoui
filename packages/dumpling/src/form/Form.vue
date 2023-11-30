<template>
  <div :class="className" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'
import {
  formItemLayoutInjectionKey,
  formLabelAlignInjectionKey,
  formLabelSizeInjectionKey,
} from './helpers'

const props = withDefaults(
  defineProps<{
    extClass: string | string[] | Record<string, boolean>
    extStyle: string | Record<string, string>
    labelSize: string
    labelAlign: 'left' | 'right'
    layout: 'horizontal' | 'vertical'
    options: {
      labelSize: string
      labelAlign: 'left' | 'right'
    }
  }>(),
  {
    extClass: '',
    extStyle: '',
    labelSize: '60px',
    labelAlign: 'left',
    layout: 'horizontal',
    options: undefined,
  },
)
const config = computed(() => {
  const { extStyle, extClass, labelSize, labelAlign, layout } = {
    ...props,
    ...props.options,
  }

  return Object.freeze({
    labelSize,
    labelAlign,
    extStyle,
    extClass,
    layout,
  })
})

const className = computed(() => {
  const { extClass } = config.value
  return classNames('du-form', extClass)
})

const style = computed(() => {
  const { extStyle } = config.value
  return typeof extStyle === 'string'
    ? extStyle
    : styleToCss({
        ...extStyle,
      })
})

provide(formLabelSizeInjectionKey, config.value.labelSize)
provide(formLabelAlignInjectionKey, config.value.labelAlign)
provide(formItemLayoutInjectionKey, config.value.layout)
</script>
