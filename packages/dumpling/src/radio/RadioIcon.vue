<template>
  <div
    :class="[
      'du-radio__radio',
      {
        'du-radio__radio--checked': checked,
        'du-radio__radio--disabled': disabled,
      },
    ]"
    :style="sizeStyle"
  ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import styleToCss from 'style-object-to-css-string'

const props = withDefaults(
  defineProps<{
    checked: boolean
    disabled: boolean
    size: string | number
  }>(),
  {
    checked: false,
    disabled: false,
    size: '',
  },
)

const sizeStyle = computed(() => {
  const style: Record<string, string | number> = {}
  if (props.size) {
    style.width = props.size
    style.height = props.size
  }
  return styleToCss(style)
})
</script>
