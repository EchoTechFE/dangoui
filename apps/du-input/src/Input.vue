<template>
  <div class="du-input" :style="style" :class="className">
    <div v-if="config.prefix" class="du-input__prefix">
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
      :type="config.type"
      :placeholder="config.placeholder"
      :disabled="config.disabled"
      :maxlength="config.maxlength"
      :focus="focus"
      :password="config.password"
      :cursor-spacing="config.cursorSpacing"
      :confirm-type="config.confirmType"
      :always-embed="config.alwaysEmbed"
      :confirm-hold="config.confirmHold"
      :selection-start="config.selectionStart"
      :selection-end="config.selectionEnd"
      :adjust-position="config.adjustPosition"
      :value="mValue"
      :autofocus="config.autofocus"
      @input="onInnerInput"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
      @keyboardheightchange="onKeyboardHeightChange"
    />
    <div v-if="config.suffix" class="du-input__suffix">
      {{ config.suffix }}
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, inject, defineComponent } from '@vue/composition-api'

import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'

export default defineComponent({
  props: {
    extClass: {
      type: [String, Array, Object],
      default: '',
    },
    extStyle: {
      type: [String, Object],
      default: '',
    },

    type: {
      type: String,
      default: 'text',
      validator: function (value) {
        // 'number', 'idcard', 'digit', 'safe-password', 'nickname' 为小程序特有
        // 'password' web特有
        return (
          ['text', 'password', 'number', 'idcard', 'digit', 'safe-password', 'nickname'].indexOf(value) !== -1
        )
      },
    },
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      default: '',
    },

    maxlength: {
      type: Number,
      default: -1,
    },
    inputAlign: {
      type: String,
      default: 'left',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    withoutBorder: {
      type: Boolean,
      default: false,
    },
    prefix: {
      type: String,
      default: '',
    },
    trim: {
      type: Boolean,
    },
    suffix: {
      type: String,
      default: '',
    },
    autofocus: {
      type: Boolean,
      default: false,
    },

    options: {
      type: Object,
      default: () => ({}),
    },

    // 以下为小程序特有
    password: {
      type: Boolean,
      default: false,
    },
    cursorSpacing: {
      type: Number,
      default: 0,
    },
    confirmType: {
      type: String,
      default: 'done',
      validator: function (value) {
        return ['send', 'search', 'next', 'go', 'done'].indexOf(value) !== -1
      },
    },
    alwaysEmbed: {
      type: Boolean,
      default: false,
    },
    confirmHold: {
      type: Boolean,
      default: false,
    },
    cursor: {
      // todo: 不清楚这个怎么对齐,wx文档里说这个还是个required
      type: Number,
    },
    selectionStart: {
      type: Number,
      default: -1,
    },
    selectionEnd: {
      type: Number,
      default: -1,
    },
    adjustPosition: {
      type: Boolean,
      default: false,
    },
    //todo: 小程序safe-password相关
  },
  emits: ['input', 'change', 'focus', 'blur', 'confirm', 'keyboardheightchange'],
  setup(props, { emit }) {
    const mValue = ref('')
    const focus = ref('')

    const config = computed(() => {
      const c = {
        ...props,
        ...props.options,
      }
      return Object.freeze(c)
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
            ...extStyle,
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
        immediate: true,
      },
    )

    watch(
      () => config.value.value,
      (val) => {
        mValue.value = val
      },
      {
        immediate: true,
      },
    )

    watch(mValue, (val) => {
      if (val !== props.value) {
        emit('input', val)
        emit('change', val)
      }
    })

    function switchFocus(status) {
      // todo: 仅支持小程序控制,需要进一步实现web端
      if (focus.value !== status) {
        focus.value = status
      }
    }

    function onFocus(...args) {
      console.log('focus')
      switchFocus(true)
      emit('focus', ...args)
    }

    function onBlur(...args) {
      console.log('blur')
      switchFocus(false)
      emit('blur', ...args)
    }

    function onConfirm(...args) {
      emit('confirm', ...args)
    }

    function onKeyboardHeightChange(...args) {
      emit('keyboardheightchange', ...args)
    }

    function onInnerInput(e) {
      let val = e.target.value
      if (config.value.trim) {
        val = val.trim()
      }

      mValue.value = val
    }

    return {
      mValue,
      className,
      style,
      config,
      focus,
      switchFocus,
      onFocus,
      onBlur,
      onConfirm,
      onKeyboardHeightChange,
      onInnerInput,
    }
  },
})
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
