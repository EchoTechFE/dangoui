<template>
  <img v-if="isImageUrl" :src="name" class="du-icon__img" :style="style" />
  <div
    v-else-if="isWeb && finalIcon"
    :class="className"
    :style="style"
    v-html="finalIcon._"
    @click="onClick"
  ></div>
  <i v-else :class="className" :style="style" @click="onClick">
    <slot>{{ unicode }}</slot>
  </i>
</template>

<script setup lang="ts">
import { computed, normalizeStyle, normalizeClass } from 'vue'
import iconConfig from './iconfont-config.json'
import { useSize } from '../composables/useSize'
import { isPlatteColor } from '../helpers/index'

const props = withDefaults(
  defineProps<{
    extClass: string | string[] | Record<string, boolean>
    extStyle:
      | string
      | {
          [x: string]: string | number
        }
    /**
     * 内置图标，从 `dangoui-icon-config` 导入，与 name 互斥
     * 在 web 侧必须用这个属性
     */
    icon?: { _: string }
    /**
     * 图标名称，可以是内置 iconfont 的名字，也可以是图片链接
     */
    name: string
    /**
     * 图标大小
     */
    size: string | number
    /**
     * 图标颜色，可以使用合法的 CSS 颜色值或者色板中具体的颜色名（如 success-solid-bg）
     *
     */
    color: string
    /**
     * 仅内部使用
     */
    unsafeInternal: string | { _: string }
  }>(),
  {
    extClass: '',
    extStyle: '',
    name: '',
    size: '',
    color: '',
    unsafeInternal: '',
  },
)

const emit = defineEmits<{
  (e: 'click', event: any): void
}>()

const isWeb = __WEB__

const finalName = computed(() => {
  const name = props.name || props.icon?._ || ''

  if (!name && props.unsafeInternal) {
    if (typeof props.unsafeInternal === 'string') {
      return props.unsafeInternal
    } else {
      return props.unsafeInternal._
    }
  }

  return name
})

const finalIcon = computed(() => {
  if (props.icon) {
    return props.icon
  }

  if (props.unsafeInternal && typeof props.unsafeInternal === 'object') {
    return props.unsafeInternal
  }

  return null
})

const isImageUrl = computed(() => {
  // TODO: 针对 svg url 提供多彩的功能，问题是如何提供 props 会比较优雅
  return /^http(s?):\/\//.test(finalName.value)
})

const className = computed(() => {
  const { extClass } = props
  if (isImageUrl.value) {
    return normalizeClass(['du-icon__img', extClass])
  }

  return normalizeClass(['du-icon', extClass])
})

const normalizedSize = useSize(() => props.size)

const style = computed(() => {
  const { extStyle } = props
  const baseStyle: Record<string, string> = {}
  if (normalizedSize.value) {
    baseStyle['--du-icon-size'] = normalizedSize.value
  }
  if (props.color) {
    if (isPlatteColor(props.color)) {
      if (props.color.includes('-')) {
        baseStyle.color = `var(--du-${props.color})`
      } else {
        baseStyle.color = `var(--du-${props.color}-text-color)`
      }
    } else {
      baseStyle.color = props.color
    }
  }

  return normalizeStyle([baseStyle, extStyle])
})

const unicode = computed(() => {
  if (!finalName.value && !finalIcon.value) {
    iconConfig.icons['question-circle-filled']
  }

  const name = finalName.value
  let config = iconConfig.icons[name as keyof typeof iconConfig.icons]
  if (!config && name.indexOf('_') > -1) {
    config =
      iconConfig.icons[name.replace(/_/g, '-') as keyof typeof iconConfig.icons]
  }
  // TODO: 下个版本替换了删掉
  const map: Record<string, string> = {
    attention: 'attention-circle',
    question: 'question-circle',
    complete: 'complete-circle',
    'complete-filled': 'complete-circle-filled',
    accountpay: 'accountpay-circle-filled',
  }

  if (!config && map[name]) {
    config = iconConfig.icons[map[name] as keyof typeof iconConfig.icons]
  }

  return config || iconConfig.icons['question-circle-filled']
})

function onClick(event: any) {
  emit('click', event)
}
</script>
