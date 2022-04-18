<template>
  <div :class="className" :style="style">
    <slot />
  </div>
</template>

<script>
import { computed, ref, watch, provide } from '@vue/composition-api'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'

export default {
  provide() {
    return {
      groupComponent: this,
    }
  },
  props: {
    extClass: {
      type: [String, Array, Object],
      default: '',
    },
    extStyle: {
      type: [String, Object],
      default: '',
    },
    inline: {
      type: Boolean,
      default: null,
    },
    cancel: {
      type: Boolean,
      default: null,
    },
    shape: {
      type: String,
      default: null,
    },
    custom: {
      type: Boolean,
      default: null,
    },
    options: {
      type: Object,
      default: () => ({}),
    },

    value: {},
  },
  setup(props, { emit }) {
    const config = computed(() => {
      const { extStyle, extClass } = {
        props,
        ...props.options,
      }

      return Object.freeze({
        extStyle,
        extClass,
      })
    })

    const className = computed(() => {
      const { extClass } = config.value
      return classNames('du-radio-group', extClass)
    })

    const style = computed(() => {
      const { extStyle } = config.value
      return typeof extStyle === 'string'
        ? extStyle
        : styleToCss({
            ...extStyle,
          })
    })

    const groupValue = ref(undefined)

    watch(
      () => props.value,
      () => {
        groupValue.value = props.value
      },
    )

    function updateValue(value) {
      groupValue.value = value
      emit('input', value)
    }

    const groupConfig = computed(() => {
      const { inline, cancel, shape, custom } = {
        ...props,
        ...props.options,
      }

      return {
        inline,
        cancel,
        shape,
        custom,
      }
    })

    provide('groupConfig', groupConfig)
    provide('groupValue', groupValue)
    provide('groupUpdateValue', updateValue)

    return {
      config,
      className,
      style,
    }
  },
}
</script>
