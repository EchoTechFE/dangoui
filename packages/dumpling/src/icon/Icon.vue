<template>
  <img v-if="isImageUrl" :src="name" class="du-icon__img" :style="style" />
  <i v-else :class="className" :style="style" @click="onClick">
    <slot>{{ unicode }}</slot>
  </i>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'
import iconConfig from './iconfont-config.json'
import { useSize } from '../composables/useSize'

const props = withDefaults(
  defineProps<{
    extClass: string | string[] | Record<string, boolean>
    extStyle: string | Record<string, string | number>
    /**
     * 图标名称，可以是内置 iconfont 的名字，也可以是图片链接
     */
    name: string
    /**
     * 图标大小
     */
    size: string | number
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

const isImageUrl = computed(() => {
  // TODO: 针对 svg url 提供多彩的功能，问题是如何提供 props 会比较优雅
  return /^http(s?):\/\//.test(props.name)
})

const className = computed(() => {
  const { extClass } = props
  if (isImageUrl.value) {
    return classNames('du-icon__img', extClass)
  }

  return classNames('du-icon', extClass)
})

const normalizedSize = useSize(() => props.size)

const style = computed(() => {
  const { extStyle } = props
  if (typeof extStyle === 'string') {
    const segments: string[] = []
    if (normalizedSize.value) {
      segments.push(`--du-icon-size:${normalizedSize.value};`)
    }
    if (props.color) {
      segments.push(`color:${props.color};`)
    }
    segments.push(extStyle)
    return segments.join('')
  }

  return styleToCss({
    '--du-icon-size': normalizedSize.value || undefined,
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
