<template>
  <div
    v-if="config.custom"
    :class="className"
    :styles="style"
    @click="handleClick"
  >
    <slot />
  </div>
  <div
    v-else
    :class="className"
    :styles="style"
    @click="handleClick"
  >
    <template v-if="config.shape === 'normal'">
      <div
        :class="[
          'du-radio__radio',
          { 'du-radio__radio--selected': isSelected },
        ]"
      />
      <slot>
        {{ config.label }}
      </slot>
    </template>

    <DuButton
      v-else-if="config.shape === 'button'"
      size="mini"
      :type="isSelected ? 'primary' : 'info'"
    >
      <slot>
        {{ config.label }}
      </slot>
    </DuButton>
  </div>
</template>

<script>
import {
  computed,
  watch,
  ref,
  inject,
  reactive,
  toRefs
} from '@vue/composition-api'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'
import DuButton from '@echoingtech/du-button/src/Button.vue'

export default {
  components: {
    DuButton
  },

  props: {
    extClass: {
      type: [String, Array, Object],
      default: ''
    },
    extStyle: {
      type: [String, Object],
      default: ''
    },
    label: {
      type: String,
      required: true,
      default: ''
    },
    shape: {
      type: String,
      default: 'normal' // normal,button
    },
    custom: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: undefined
    },
    cancel: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean
    },
    options: {
      type: Object,
      default: () => ({})
    },
    value: {}
  },
  setup (props, { emit }) {
    const groupConfig = inject('groupConfig', null)
    const groupValue = inject('groupValue', ref(null))
    const groupUpdateValue = inject('groupUpdateValue', null)

    const state = reactive({
      currentVal: undefined
    })

    watch(groupValue, (val) => {
      state.currentVal = val
    })

    watch(
      () => props.value,
      (val) => {
        state.currentVal = val
      }
    )

    const config = computed(() => {
      const {
        extStyle,
        extClass,
        label,
        inline,
        cancel,
        custom,
        disabled,
        shape
      } = {
        ...props,
        ...props.options
      }

      const {
        inline: radioInline,
        cancel: radioCancel,
        shape: radioShape,
        custom: radioCustom
      } = groupConfig ? groupConfig.value : {}

      return Object.freeze({
        extStyle,
        extClass,
        label,
        custom: radioCustom !== undefined ? radioCustom : custom,
        shape: radioShape !== undefined ? radioShape : shape,
        inline: radioInline !== undefined ? radioInline : inline,
        cancel: radioCancel !== undefined ? radioCancel : cancel,
        disabled
      })
    })
    const className = computed(() => {
      const { inline, disabled, extClass } = config.value
      return classNames(
        'du-radio',
        {
          'du-radio--inline': inline,
          'du-radio--disabled': disabled
        },
        extClass
      )
    })

    const style = computed(() => {
      const { extStyle } = config.value
      return typeof extStyle === 'string'
        ? extStyle
        : styleToCss({
          ...extStyle
        })
    })

    const isSelected = computed(() => {
      const { label } = config.value

      return label === state.currentVal
    })

    function update (val) {
      state.currentVal = val
      if (groupUpdateValue) {
        groupUpdateValue(val)
      }
      emit('input', val)
    }

    function handleClick () {
      const { label, cancel, disabled } = config.value
      emit('click')
      if (disabled) {
        return
      }
      update(isSelected.value && cancel ? null : label)
    }

    return {
      ...toRefs(state),
      className,
      style,
      config,
      isSelected,
      handleClick
    }
  }
}
</script>

<style lang="scss">
.du-radio {
  display: flex;
  align-items: center;

  width: 100%;
  padding: 8rpx 0;

  color: rgba(32, 36, 38, 1);
  font-size: 28rpx;
  line-height: 48rpx;

  &--inline {
    display: inline-flex;
    width: max-content;
    margin: 0 16rpx 0 0;
  }
  &--disabled {
    opacity: 0.6;
  }
  &__radio {
    width: 32rpx;
    height: 32rpx;
    margin-right: 12rpx;
    overflow: hidden;

    background: rgba(32, 36, 38, 0.1);
    border-radius: 50%;
    &--selected {
      background: rgba(5, 190, 169, 1)
        url('https://cdn.qiandaoapp.com/admins/0a302173967d8d7a999fc17842bc886a.png')
        no-repeat 100%/100%;
    }
  }
  &__input {
    flex: 1 0 0;
    margin-left: 16rpx;
  }
}
</style>
