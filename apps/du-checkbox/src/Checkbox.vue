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
import { reactive, computed, inject, ref, getCurrentInstance, toRefs, watch } from 'vue'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'
import CheckboxIcon from './CheckboxIcon.vue'

function findComponentUpward(component, parentName) {
  const parent = component.parent

  if (parent) {
    if (parent.proxy.className === parentName) {
      return parent
    } else {
      return findComponentUpward(parent, parentName)
    }
  } else {
    return null
  }
}

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
      type: Boolean,
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
      default: '40rpx',
    },
  },
  emits: ['click', 'input', 'update:value', 'input'],
  setup(props, { emit }) {
    const state = reactive({
      currentVal: false,
    })

    const groupConfig = inject('groupConfig', ref({}))
    const groupValue = inject('groupValue', ref([]))
    const setGroupValue = inject('setGroupValue', () => {})

    watch(
      () => props.value,
      (val) => {
        state.currentVal = val
      },
      {
        immediate: true,
      },
    )

    watch(
      groupValue,
      (gvList) => {
        if (gvList.length === 0) return

        const { value } = props

        state.currentVal = !!gvList?.find((gv) => gv === value)
      },
      { immediate: true },
    )

    const config = computed(() => {
      const { extClass, extStyle, shape, inline, disabled, label, value, custom, position } = props
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
      const { label, value } = config.value
      return label || value || ''
    })

    function onClick() {
      if (props.disabled) return

      const { label, value } = config.value

      state.currentVal = !state.currentVal

      emit('click', state.currentVal)
      emit('input', state.currentVal)

      emit('update:value', state.currentVal)

      if (groupValue.value && setGroupValue) {
        let gv
        if (state.currentVal && !groupValue.value?.find((g) => g === label)) {
          gv = [...groupValue.value, label || value]
        } else {
          gv = groupValue.value.filter((item) => item !== (label || value))
        }
        setGroupValue(gv)
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
