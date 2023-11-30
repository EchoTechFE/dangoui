<template>
  <i :class="className" :style="style" @click="onClick">
    <slot>{{ unicode }}</slot>
  </i>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'
import iconConfig from './iconfont-config.json'

const props = withDefaults(
  defineProps<{
    extClass: string | string[] | Record<string, boolean>
    extStyle: string | Record<string, string | number>
    /**
     * 图标名称
     */
    name: string
    /**
     * 图标大小
     */
    size: string
    /**
     * 图标颜色
     *
     */
    color: string
  }>(),
  {
    extClass: '',
    extStyle: '',
    name: '',
    size: '',
    color: '',
  },
)

const emit = defineEmits<{
  (e: 'click'): void
}>()

const className = computed(() => {
  const { extClass } = props
  return classNames('du-icon', extClass)
})

const style = computed(() => {
  const { extStyle } = props
  if (typeof extStyle === 'string') {
    const segments: string[] = []
    if (props.size) {
      segments.push(`font-size:${props.size};`)
    }
    if (props.color) {
      segments.push(`color:${props.color};`)
    }
    segments.push(extStyle)
    return segments.join('')
  }

  return styleToCss({
    fontSize: props.size || undefined,
    color: props.color || undefined,
    ...extStyle,
  })
})

const unicode = computed(() => {
  if (!props.name) {
    iconConfig.icons['question-circle-filled']
  }
  let config = iconConfig.icons[props.name as keyof typeof iconConfig.icons]
  if (!config && props.name.indexOf('_') > -1) {
    config =
      iconConfig.icons[
        props.name.replace(/_/g, '-') as keyof typeof iconConfig.icons
      ]
  }
  // TODO: 下个版本替换了删掉
  const map: Record<string, string> = {
    attention: 'attention-circle',
    question: 'question-circle',
    complete: 'complete-circle',
    'complete-filled': 'complete-circle-filled',
    accountpay: 'accountpay-circle-filled',
  }

  if (!config && map[props.name]) {
    config = iconConfig.icons[map[props.name] as keyof typeof iconConfig.icons]
  }

  return config || iconConfig.icons['question-circle-filled']
})

function onClick() {
  emit('click')
}
</script>
