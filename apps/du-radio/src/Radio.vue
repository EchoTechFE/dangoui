<template>
  <div
    v-if="config?.custom"
    :class="className"
    :styles="style"
    @click="handleClick"
  >
    <slot />
  </div>
  <div v-else :class="className" :styles="style" @click="handleClick">
    <template v-if="config?.shape === 'normal'">
      <template v-if="config?.cell">
        <div class="du-radio__label">
          <slot>
            {{ config?.label }}
          </slot>
        </div>
        <RadioIcon :checked="checked" />
      </template>
      <template v-else>
        <RadioIcon :checked="checked" />
        <div class="du-radio__label">
          <slot>
            {{ config?.label }}
          </slot>
        </div>
      </template>
    </template>

    <DuButton
      v-else-if="config.shape === 'button'"
      size="mini"
      :type="checked ? 'primary' : 'info'"
    >
      <slot>
        {{ config?.label }}
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
  toRefs,
  defineComponent,
  toRaw,
} from 'vue'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'
import DuButton from '@frontend/du-button/src/Button.vue'
import RadioIcon from './_Radio.vue'

export default defineComponent({
  components: {
    DuButton,
    RadioIcon,
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
    label: {
      default: true,
    },
    shape: {
      type: String,
      default: 'normal',
    },
    custom: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    cancel: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
    },
    cell: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    value: {},
  },
  emits: ['click', 'input', 'update:value', 'input'],
  setup(props, { emit }) {
    const GROUP_VALUE_DEFAULT = {}
    const groupConfig = inject('groupConfig', null)
    const groupValue = inject('groupValue', ref(GROUP_VALUE_DEFAULT))
    const groupUpdateValue = inject('groupUpdateValue', null)

    const state = reactive({
      currentVal: false,
    })

    watch(
      groupValue,
      (val) => {
        if (val != GROUP_VALUE_DEFAULT) {
          state.currentVal = val
        }
      },
      {
        immediate: true,
      }
    )

    watch(
      () => props.value,
      (val) => {
        if (toRaw(groupValue.value) === GROUP_VALUE_DEFAULT) {
          state.currentVal = val
        }
      },
      {
        immediate: true,
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
        shape,
        cell,
      } = {
        ...props,
        ...props.options,
      }

      return Object.freeze({
        extStyle,
        extClass,
        label,
        inline,
        cancel,
        custom,
        disabled,
        shape,
        cell,

        ...(groupConfig ? groupConfig.value : {}),
      })
    })
    const className = computed(() => {
      const { inline, disabled, extClass, cell } = config.value
      return classNames(
        'du-radio',
        {
          'du-radio--inline': inline,
          'du-radio--disabled': disabled,
          'du-radio--cell': cell,
        },
        extClass
      )
    })

    const style = computed(() => {
      const { extStyle } = config.value
      return typeof extStyle === 'string'
        ? extStyle
        : styleToCss({
            ...extStyle,
          })
    })

    const checked = computed(() => {
      const { label } = config.value

      return label === state.currentVal
    })

    function update(val) {
      state.currentVal = val
      if (groupUpdateValue) {
        groupUpdateValue(val)
      }
      emit('input', val)
      emit('update:value', val)
    }

    function handleClick() {
      const { label, cancel, disabled } = config.value
      emit('click')
      if (disabled) {
        return
      }
      update(checked.value && cancel ? false : label)
    }

    return {
      ...toRefs(state),
      className,
      style,
      config,
      checked,
      handleClick,
    }
  },
})
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
  $c: &;
  &__label {
    margin-left: 12rpx;
  }

  &--inline {
    display: inline-flex;
    width: max-content;
    margin: 0 16rpx 0 0;
  }
  &--cell {
    justify-content: space-between;
    /* TODO: 这里用不了#{$c}__label，不知道什么原因 */
    .du-radio__label {
      margin-left: 0;
      margin-right: 12rpx;
    }
  }
  &--disabled {
    opacity: 0.6;
  }
}
</style>
