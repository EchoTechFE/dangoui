<template>
  <div
    :class="`du-icon-button du-icon-button--${size} ${extClass}`"
    :style="style"
    @click="onClick"
  >
    <DuIcon
      class="du-icon-button-icon"
      :name="name"
      :icon="icon"
      :size="duSize"
    />
    <text
      v-if="text"
      :class="`du-icon-button-text du-icon-button-text--${size}`"
      :style="textStyle"
    >
      {{ text }}
    </text>
  </div>
</template>

<script setup lang="ts">
import { computed, normalizeStyle } from 'vue'
import DuIcon from '../icon/Icon.vue'
import { isPlatteColor } from '../helpers/index'

const props = withDefaults(
  defineProps<{
    extClass: string | string[] | Record<string, boolean>
    /**
     * 自定义 style
     */
    extStyle:
      | string
      | {
          [x: string]: string | number
        }
    /**
     * 色彩，可以使用色板中的颜色名
     */
    color: string
    /**
     * 按钮交互热区大小
     */
    size: 'mini' | 'small' | 'normal' | 'medium' | 'large'
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
    iconSize: string
    /**
     * 文字
     */
    text: string
    /**
     * 文字颜色，可以使用色板中的颜色名
     */
    textColor: string
    disabled: boolean
  }>(),
  {
    extClass: '',
    extStyle: () => ({}),
    color: '',
    size: 'normal',
    iconSize: '',
    text: '',
    textColor: '',
    disabled: false,
  }
)

const iconSizeObj = {
  mini: 12,
  small: 14,
  normal: 16,
  medium: 20,
  large: 24,
}
const duSize = computed(() => props.iconSize || iconSizeObj[props.size])
const emit = defineEmits<{
  (e: 'click', event: any): void
}>()
const style = computed(() => {
  const { extStyle, color } = props
  const baseStyle: Record<string, string> = {}
  baseStyle.color = getColor(color)
  return normalizeStyle([extStyle, baseStyle])
})
const textStyle = computed(() => {
  if (props.textColor) {
    return `color:${getColor(props.textColor)}`
  }
  return ''
})
function getColor(color: string) {
  if (color && isPlatteColor(color)) {
    if (color.includes('-')) {
      color = `var(--du-${color})`
    } else {
      color = `var(--du-${color}-text-color)`
    }
  }
  return color
}
function onClick(event: any) {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>
