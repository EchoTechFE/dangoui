<template>
  <div
    :class="[
      'du-radio__radio',
      `du-c-${color}-radio`,
      {
        'du-radio__radio--checked': checked,
        'du-radio__radio--disabled': disabled,
      },
    ]"
    :style="sizeStyle"
  ></div>
</template>

<script setup lang="ts">
import { computed, normalizeStyle } from 'vue'

const props = withDefaults(
  defineProps<{
    checked: boolean
    disabled: boolean
    size: string | number
    /**
     * 色彩，可以使用色板中的颜色名
     */
    color: string
  }>(),
  {
    checked: false,
    disabled: false,
    size: '',
    color: 'primary',
  },
)

const sizeStyle = computed(() => {
  const style: Record<string, string | number> = {}
  if (props.size) {
    style.width = props.size
    style.height = props.size
  }
  return normalizeStyle(style)
})
</script>
