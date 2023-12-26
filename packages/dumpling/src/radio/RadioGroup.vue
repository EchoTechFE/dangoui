<template>
  <div :class="className" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, provide, normalizeStyle } from 'vue'
import classNames from 'classnames'
import {
  groupConfigInjectionKey,
  groupValueInjectionKey,
  setGroupValueInjectionKey,
} from './helpers'

const props = withDefaults(
  defineProps<{
    extClass?: string | string[] | Record<string, boolean>
    extStyle:
      | string
      | {
          [x: string]: string | number
        }
    /**
     * 是否为行内展示
     */
    inline?: boolean
    /**
     * 形状，圆形还是按钮形式
     */
    shape?: 'normal' | 'button'
    /**
     * 开启后，label 与 radio 呈左右两边排布
     */
    cell?: boolean
    /**
     * 自定义子节点
     */
    custom?: boolean
    /**
     * 选中的值
     */
    value?: any
    /**
     * 如果值为对象，进行选中值相等判断时，会取该对象的 valueKey 属性值进行判断
     */
    valueKey?: string
    /**
     * 颜色
     */
    color?: string
  }>(),
  {
    extClass: '',
    extStyle: '',
    inline: false,
    cell: false,
    custom: false,
    color: undefined,
  },
)

const emit = defineEmits<{
  (e: 'input', value: string | number | undefined): void
  (e: 'update:value', value: string | number | undefined): void
}>()

const config = computed(() => {
  const { extStyle, extClass } = props

  return {
    extStyle,
    extClass,
  }
})

const className = computed(() => {
  const { extClass } = config.value
  return classNames(
    'du-radio-group',
    {
      'du-radio-group--inline': props.inline,
      'du-radio-group--custom': props.custom,
    },
    extClass,
  )
})

const style = computed(() => {
  const { extStyle } = config.value
  return normalizeStyle(extStyle)
})

const groupValue = ref<string | number | undefined>(undefined)

watch(
  () => props.value,
  (val) => {
    groupValue.value = val
  },
  {
    immediate: true,
  },
)

function updateValue(value: string | number | undefined) {
  groupValue.value = value
  emit('input', value)
  emit('update:value', value)
}

const groupConfig = computed(() => {
  const { inline, shape, custom, cell, color, valueKey } = props

  return {
    inline,
    shape,
    custom,
    cell,
    valueKey,
    color,
  }
})

provide(groupConfigInjectionKey, groupConfig)
provide(groupValueInjectionKey, groupValue)
provide(setGroupValueInjectionKey, updateValue)
</script>
