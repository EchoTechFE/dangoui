<template>
  <div
    class="du-input"
    :style="style"
    :class="className"
  >
    <div
      v-if="config.prefix"
      class="du-input__prefix"
    >
      {{ config.prefix }}
    </div>
    <input
      :class="[
        'du-input__input',
        {
          'du-input__input--align-right': config.inputAlign === 'right',
          'du-input__input--align-center': config.inputAlign === 'center',
          'du-input__input--disabled': config.disabled,
          'du-input__input--without-border': config.withoutBorder,
        },
      ]"
      placeholder-class="du-input__input--placeholder"
      :focus="focus"
      :type="config.type"
      :placeholder="config.placeholder"
      :disabled="config.disabled"
      v-model="mValue"
      @focus="switchFocus(true)"
      @blur="switchFocus(false)"
    >
    <div
      v-if="config.suffix"
      class="du-input__suffix"
    >
      {{ config.suffix }}
    </div>
  </div>
</template>

<script>
import {
  toRefs,
  reactive,
  computed,
  watch,
  inject
} from '@vue/composition-api'

import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'

export default {
  props: {
    extClass: {
      type: [String, Array, Object],
      default: ''
    },
    extStyle: {
      type: [String, Object],
      default: ''
    },

    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      default: ''
    },
    inputAlign: {
      type: String,
      default: 'left'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    withoutBorder: {
      type: Boolean,
      default: false
    },
    prefix: {
      type: String,
      default: ''
    },
    trim: {
      type: Boolean
    },
    suffix: {
      type: String,
      default: ''
    },
    autoFocus: {
      type: Boolean,
      default: false
    },
    confirmType: {
      // TODO:
      type: String
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props, { emit }) {
    const state = reactive({
      mValue: '',
      focus: false
    })

    const config = computed(() => {
      const {
        type,
        placeholder,
        inputAlign,
        disabled,
        withoutBorder,
        prefix,
        suffix,
        trim,
        autoFocus,
        value,
        extStyle,
        extClass
      } = {
        ...props,
        ...props.options
      }

      return Object.freeze({
        extClass,
        extStyle,
        type,
        placeholder,
        inputAlign,
        disabled,
        withoutBorder,
        prefix,
        suffix,
        trim,
        value,
        autoFocus
      })
    })

    const className = computed(() => {
      const { extClass } = config.value
      return classNames('du-input', extClass)
    })

    const style = computed(() => {
      const { extStyle } = config.value
      return typeof extStyle === 'string'
        ? extStyle
        : styleToCss({
          ...extStyle
        })
    })

    const listenFormItemOnClick = inject('listenFormItemOnClick', null)

    watch(
      () => listenFormItemOnClick,
      (listenOnClick) => {
        if (listenOnClick) {
          listenOnClick(() => switchFocus(true))
        }
      },
      {
        immediate: true
      }
    )

    watch(
      () => config.value.value,
      (val) => {
        state.mValue = val
      },
      {
        immediate: true
      }
    )

    watch(
      () => config.value.autoFocus,
      (val) => {
        state.focus = state.focus || val
      },
      {
        immediate: true
      }
    )

    watch(
      () => state.mValue,
      (val, oval) => {
        if (val !== props.value) {
          emit('input', val)
          emit('change', val, oval)
        }
      }
    )

    function switchFocus (status) {
      if (state.focus !== status) {
        state.focus = status
      }
    }

    return {
      ...toRefs(state),
      className,
      style,
      config,
      switchFocus
    }
  }
}
</script>

<style lang="scss">
.du-input {
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 4rpx 0;

  font-size: 28rpx;
  line-height: 44rpx;

  &__prefix {
    margin-right: 8rpx;

    opacity: 0.4;
  }

  &__suffix {
    margin-left: 8rpx;

    opacity: 0.4;
  }

  &__input {
    flex: 1 0 0;
    min-width: 0;

    font-size: 28rpx;

    line-height: 44rpx;

    background: none;

    border: none;
    border-bottom: 1px solid rgba(32, 36, 38, 0.06);
    outline: none;
    &--without-border {
      border: none;
    }
    &--align {
      &-right {
        text-align: right;
      }
      &-center {
        text-align: center;
      }
    }
    &--disabled {
      color: var(--du-input-disabled-color);
    }
    &--placeholder {
      color: var(--du-input-placeholder-color);
    }
    &::placeholder {
      color: var(--du-input-placeholder-color);
    }
  }
}
</style>
