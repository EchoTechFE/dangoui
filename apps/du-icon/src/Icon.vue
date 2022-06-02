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
    size: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
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
      if (typeof extStyle === 'string') {
        const segments = []
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
      let config = iconConfig.icons[props.name]
      if (!config && props.name.indexOf('_') > -1) {
        config = iconConfig.icons[props.name.replace(/_/g, '-')]
      }
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
:root,
page {
  --du-icon-fz: 24rpx;
}
.du-icon {
  font-family: 'dumpling-icon' !important;

  font-size: var(--du-icon-fz);
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
