<template>
  <div :class="className" :style="style">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch, normalizeStyle, inject } from 'vue'
import classNames from 'classnames'
import {
  groupConfigInjectionKey,
  groupValueInjectionKey,
  setGroupValueInjectionKey,
} from './helpers'
import { formItemLayoutInjectionKey } from '../form/helpers'
import { useSize } from '../composables/useSize'

const props = withDefaults(
  defineProps<{
    extClass: string | string[] | Record<string, boolean>
    extStyle:
      | string
      | {
          [x: string]: string | number
        }
    /**
     * 形状
     */
    shape?: 'round' | 'square'
    /**
     * 是否一行展示
     */
    inline?: boolean
    /**
     * 对勾图标位置
     */
    position?: 'left' | 'right'
    /**
     * 当前选中的值
     */
    value: Array<string>
    /**
     * custom
     */
    custom?: boolean
    /**
     * 颜色
     */
    color: string
  }>(),
  {
    extClass: '',
    extStyle: '',
    value: () => [],
    color: undefined,
  },
)

const emit = defineEmits<{
  (e: 'input', value: Array<string>): void
  (e: 'update:value', value: Array<string>): void
}>()

const className = computed(() => {
  const { extClass } = props

  return classNames(
    'du-checkbox-group',
    {
      'du-checkbox-group--inline': props.inline,
      'du-checkbox-group--custom': props.custom,
    },
    extClass,
  )
})

const formItemLayout = inject(formItemLayoutInjectionKey)

const marginYInFormItem = useSize(() => 10)

const style = computed(() => {
  const { extStyle } = props

  const styles = [extStyle]

  if (
    formItemLayout === 'horizontal' &&
    marginYInFormItem.value &&
    !props.inline
  ) {
    styles.unshift({
      marginTop: marginYInFormItem.value,
      marginBottom: marginYInFormItem.value,
    })
  }

  return normalizeStyle(styles)
})

const groupConfig = computed(() => {
  const { shape, inline, position, color } = props

  return {
    shape,
    inline,
    position,
    color,
  }
})

const groupValue = ref<Array<string>>([])

watch(
  () => props.value,
  (v) => {
    groupValue.value = v
  },
  {
    immediate: true,
  },
)

function setGroupValue(value: Array<string>) {
  emit('input', value)
  emit('update:value', value)
}

provide(groupConfigInjectionKey, groupConfig)
provide(groupValueInjectionKey, groupValue)
provide(setGroupValueInjectionKey, setGroupValue)
</script>
