<template>
  <div :class="['du-divider', `du-divider--${config.type}`]" :style="style">
    <template v-if="config.type === 'horizontal'">
      <div class="du-divider__left" />
      <div class="du-divider__content">
        <slot />
      </div>
      <div class="du-divider__right" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { CSSProperties, computed, inject } from 'vue'
import { dividerInjectionKey } from './helpers'
import { useSize } from '../composables/useSize'
import { isPlatteColor } from '../helpers'

const props = withDefaults(
  defineProps<{
    /**
     * 色彩，可以使用合法的 CSS 颜色值或者色板中具体的颜色名（如 primary-solid-color）
     *
     */
    color?: string
    /**
     * 分割线水平或者竖直
     */
    type?: 'horizontal' | 'vertical'
    /**
     * 分割线长度，默认为 100%
     */
    length?: number | string
  }>(),
  {
    type: undefined,
    length: undefined,
  },
)

const dividerConfig = inject(dividerInjectionKey)

const config = computed(() => {
  const type =
    props.type || dividerConfig?.defaultType || ('horizontal' as const)
  const length = props.length || dividerConfig?.length?.value

  return {
    type,
    length,
  }
})

const resolvedLength = useSize(() => config.value.length)

const style = computed(() => {
  const css: CSSProperties = {}

  const { length } = config.value

  if (config.value.type === 'horizontal' && length) {
    css.marginLeft = 0
    css.width = resolvedLength.value
  } else if (config.value.type === 'vertical' && length) {
    css.marginTop = 0
    css.height = resolvedLength.value
  }

  if (props.color) {
    if (isPlatteColor(props.color)) {
      if (props.color.includes('-')) {
        css.color = `var(--du-${props.color})`
      }
    } else {
      css.color = props.color
    }
  }

  return css
})
</script>
