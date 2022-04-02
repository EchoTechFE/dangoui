<template>
  <i :class="className" :style="style" @click="onClick">
    <slot>{{ unicode }}</slot>
  </i>
</template>

<script>
import { computed } from '@vue/composition-api'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'
import iconConfig from './iconfont-config.json'
import './iconfont.css'
export default {
  props: {
    extClass: {
      type: [String, Array, Object],
      default: '',
    },
    extStyle: {
      type: [String, Object],
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const className = computed(() => {
      const { extClass } = props
      return classNames('du-icon', extClass)
    })
    const style = computed(() => {
      const { extStyle } = props
      return typeof extStyle === 'string'
        ? extStyle
        : styleToCss({
            ...extStyle,
          })
    })
    const unicode = computed(() => {
      const config = iconConfig.icons[props.name]
      return config
    })

    function onClick(...args) {
      emit('click', ...args)
    }

    return {
      unicode,
      className,
      style,
      onClick,
    }
  },
}
</script>

<style lang="scss">
.du-icon {
  font-family: 'dumpling-icon' !important;
  font-size: 24rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
