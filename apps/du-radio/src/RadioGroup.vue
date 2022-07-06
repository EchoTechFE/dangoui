<template>
  <div :class="className" :style="style">
    <slot />
  </div>
</template>

<script>

import { computed, ref, watch, provide } from 'vue'
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
      default: false,
    },
    cancel: {
      type: Boolean,
      default: false,
    },
    shape: {
      type: String,
      default: 'normal',
    },
    cell: {
      type: Boolean,
      default: false,
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
  emits: ['input', 'update:value'],
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
      (val) => {
        groupValue.value = val
      },
      {
        immediate: true,
      }
    )

    function updateValue(value) {
      groupValue.value = value
      emit('input', value)
      emit('update:value', value)
    }

    const groupConfig = computed(() => {
      const { inline, cancel, shape, custom, cell } = {
        ...props,
        ...props.options,
      }

      return {
        inline,
        cancel,
        shape,
        custom,
        cell,
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
