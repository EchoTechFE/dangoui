<template>
  <div v-if="custom" :class="className" :style="style" @click="onClick">
    <slot />
  </div>
  <div v-else :class="className" :style="style" @click="onClick">
    <div class="du-checkbox__label">
      <slot>{{ content }}</slot>
    </div>
    <checkbox-icon :selected="selected" :shape="config?.shape" :size="config.size" />
  </div>
</template>

<script>
import { reactive, computed, inject, ref, toRefs, watch } from 'vue'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'
import CheckboxIcon from './CheckboxIcon.vue'

export default {
  name: 'du-checkbox',
  components: {
    CheckboxIcon,
  },
  props: {
    extClass: {
      type: [String, Array],
      default: '',
    },
    extStyle: {
      type: [String, Object],
      default: '',
    },
    shape: {
      type: String,
      default: 'round',
    },
    inline: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: [String, Number],
    },
    value: {
      type: [Boolean, Number, String],
      default: false,
    },
    custom: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: 'right',
    },
    size: {
      type: String,
      default: '20px',
    },
  },
  emits: ['click', 'input', 'update:value', 'input'],
  setup(props, { emit }) {
    const state = reactive({
      currentVal: false,
    })

    const groupConfig = inject('groupConfig', ref({}))
    const groupValue = inject('groupValue', ref(undefined))
    const setGroupValue = inject('setGroupValue', () => {})

    watch(
      () => props.value,
      (val) => {
        if (!groupValue.value) {
          state.currentVal = val
        }
      },
      {
        immediate: true,
      },
    )

    watch(
      groupValue,
      () => {
        const { value } = props
        if (!groupValue.value) return

        state.currentVal = !!groupValue.value?.find((gv) => gv === value)
      },
      { immediate: true },
    )

    const config = computed(() => {
      const { extClass, extStyle, shape, inline, disabled, label, value, custom, position, size } = props
      const { shape: gShape, inline: gInline, position: gPosition } = groupConfig.value

      return Object.freeze({
        extClass,
        extStyle,
        disabled,
        label,
        value,
        custom,
        shape: gShape ? gShape : shape,
        inline: gInline ? gInline : inline,
        position: gPosition ? gPosition : position,
        size,
      })
    })

    const className = computed(() => {
      const { extClass, inline, disabled, position } = config.value
      return classNames(
        ['du-checkbox', 'du-checkbox--' + position],
        {
          'du-checkbox--disabled': disabled,
          'du-checkbox--inline': inline,
        },
        extClass,
      )
    })

    const style = computed(() => {
      const { extStyle } = config.value
      return typeof extStyle === 'string' ? extStyle : styleToCss({ ...extStyle })
    })

    const selected = computed(() => {
      return !!state.currentVal
    })

    const content = computed(() => {
      const { label } = config.value
      return label || ''
    })

    function onClick() {
      if (props.disabled) return

      const { value } = config.value

      if (groupValue.value && setGroupValue) {
        let gv
        if (!groupValue.value?.find((g) => g === value)) {
          gv = [...groupValue.value, value]
        } else {
          gv = groupValue.value.filter((item) => item !== value)
        }

        setGroupValue(gv)
      } else {
        emit('click', !state.currentVal)
        emit('input', !state.currentVal)

        emit('update:value', !state.currentVal)
      }
    }

    return {
      style,
      className,
      config,
      selected,
      content,
      onClick,
      ...toRefs(state),
    }
  },
}
</script>

<style lang="scss">
.du-checkbox {
  display: flex;
  align-items: center;

  padding: 8rpx 0;

  font-size: 28rpx;
  line-height: 48rpx;

  &__label {
    flex: 1 0 0;
  }

  &--left {
    flex-direction: row-reverse;
  }

  &--inline {
    display: inline-flex;
    width: auto;
  }

  &--disabled {
    opacity: 0.6;
  }
}
</style>
