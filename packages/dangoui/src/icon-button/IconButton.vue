<template>
  <div
    :class="`du-icon-button du-icon-button--${size} ${extClass}`"
    :style="style"
    @click="onClick"
  >
    <DuIcon
      :color="color"
      :name="name"
      :size="duSize"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, normalizeStyle } from 'vue'
import DuIcon from '../icon/Icon.vue'

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
     * iconname
     */
    name: string
    /**
     * 图标大小
     */
    iconSize: string
  }>(),
  {
    extClass: '',
    extStyle: () => ({}),
    color: '',
    size: 'normal',
    iconSize: '',
  }
)
const iconSizes = ref<any>({
  mini: 6,
  small: 7,
  normal: 8,
  medium: 10,
  large: 12,
})
const duSize = computed(() => props.iconSize || iconSizes[props.size])
const emit = defineEmits<{
  (e: 'click', event: any): void
}>()
const style = computed(() => {
  const { extStyle } = props
  return normalizeStyle(extStyle)
})

function onClick(event: any) {
  emit('click', event)
}
</script>
