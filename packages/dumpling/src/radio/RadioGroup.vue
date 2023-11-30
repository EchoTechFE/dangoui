<template>
  <div :class="className" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, provide } from 'vue'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'
import {
  groupConfigInjectionKey,
  groupValueInjectionKey,
  setGroupValueInjectionKey,
} from './helpers'

const props = withDefaults(
  defineProps<{
    extClass?: string | string[] | Record<string, boolean>
    extStyle?: string | Record<string, string | number>
    inline?: boolean
    shape?: 'normal' | 'button'
    cell?: boolean
    custom?: boolean
    value?: any
    valueKey?: string
  }>(),
  {
    extClass: '',
    extStyle: '',
    inline: false,
    shape: 'normal',
    cell: false,
    custom: false,
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
    },
    extClass,
  )
})

const style = computed(() => {
  const { extStyle } = config.value
  return typeof extStyle === 'string'
    ? extStyle
    : styleToCss({
        ...extStyle,
      })
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
  const { inline, shape, custom, cell, valueKey } = props

  return {
    inline,
    shape,
    custom,
    cell,
    valueKey,
  }
})

provide(groupConfigInjectionKey, groupConfig)
provide(groupValueInjectionKey, groupValue)
provide(setGroupValueInjectionKey, updateValue)
</script>
