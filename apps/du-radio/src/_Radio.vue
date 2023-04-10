<template>
  <div
    :class="[
      'du-radio__radio',
      { 'du-radio__radio--checked': checked, 'du-radio__radio--disabled': disabled },
    ]"
    :style="sizeStyle"
  ></div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import DuIcon from '@frontend/du-icon/src/Icon.vue'
import styleToCss from 'style-object-to-css-string'

export default defineComponent({
  components: {
    DuIcon,
  },
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: [String, Number],
      default: '',
    },
  },
  setup(props) {
    const sizeStyle = computed(() => {
      const style = {}
      if (props.size) {
        style.width = props.size
        style.height = props.size
      }
      return styleToCss(style)
    })

    return {
      sizeStyle,
    }
  },
})
</script>

<style lang="scss">
.du-radio {
  &__radio {
    width: 40rpx;
    height: 40rpx;
    overflow: hidden;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;
    border: 1px solid rgba(0, 0, 0, 0.12);
    &--checked {
      border-color: var(--du-color-main);
      &::after {
        // 用 absolute 视觉上会有一点偏差
        width: 28rpx;
        height: 28rpx;
        border-radius: 50%;
        display: block;
        content: '';
        background: var(--du-color-main);
      }
    }
    &--disabled {
      background: rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(0, 0, 0, 0.08);
    }
  }
}
</style>
