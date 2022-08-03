<template>
  <transition name="fade">
    <div :style="style" :class="className" v-if="show">
      <div v-if="showClose" class="du-snackbar__close">
        <DuIcon
          @click="emitClose"
          extClass="du-snackbar__close__icon"
          name="close_circle_filled"
        />
        <div class="du-snackbar__close__bgc"></div>
      </div>
      {{ content }}
      <DuButton
        :text="mergedProps?.text"
        :type="mergedProps?.type"
        :size="mergedProps?.size"
        :ghost="mergedProps?.ghost"
        :round="mergedProps?.round"
        :extClass="mergedProps?.extClass"
        :extStyle="mergedProps?.extStyle"
        @click="emitAction"
        :style="{ flex: 'none', marginLeft: 'auto' }"
      />
    </div>
  </transition>
</template>

<script>

import { computed } from 'vue'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'
import DuButton from '@frontend/du-button/src/Button.vue'
import DuIcon from '@frontend/du-icon/src/Icon.vue'

export default {
  components: {
    DuButton,
    DuIcon,
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
    offset: {
      type: Number,
      default: 0,
    },
    offsetPosition: {
      type: String,
      default: 'bottom',
    },
    duration: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: true,
    },
    showClose: {
      type: Boolean,
      default: false,
    },
    buttonProps: {
      type: Object,
      default: () => ({}),
    },
    revertColor: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'action'],
  setup(props, { emit }) {
    const className = computed(() => {
      const { extClass, revertColor } = props
      return classNames('du-snackbar', extClass, {
        'revert-color': revertColor,
      })
    })
    const style = computed(() => {
      const { extStyle, offset, offsetPosition } = props
      const vw = offset / 7.5
      const defaultStyle =
        offset > 0
          ? {
              position: 'fixed',
              left: 0,
              right: 0,
              [offsetPosition]: `${vw}vw`,
            }
          : {}
      const defaultStyleString = styleToCss(defaultStyle)
      return typeof extStyle === 'string'
        ? `${extStyle};${defaultStyleString}`
        : styleToCss({
            ...defaultStyle,
            ...extStyle,
          })
    })
    const mergedProps = computed(() => {
      const { buttonProps } = props
      const extClass = classNames('du-snackbar__action', buttonProps.extClass)
      return {
        size: 'mini',
        ...buttonProps,
        extClass,
      }
    })
    const emitClose = () => emit('close')
    const emitAction = () => emit('action')
    watch(() => props.show, show => {
      const { duration } = props
      if (show && duration > 0) {
        setTimeout(emitClose, duration * 1000)
      }
    }, {
      immediate: true
    })
    return {
      className,
      style,
      mergedProps,
      emitClose,
      emitAction,
    }
  },
  options: {
    styleIsolation: 'shared',
  },
}
</script>

<style lang="scss">
.du-snackbar {
  width: 730rpx;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 20rpx 24rpx;
  font-size: 24rpx;
  color: #fff;
  background-color: var(--du-snackbar-primary);
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  overflow: hidden;
  &__close {
    line-height: 1;
    margin-right: 16rpx;
    position: relative;
    &__icon {
      font-size: 32rpx;
      color: #fff;
    }
    &__bgc {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 16rpx;
      height: 16rpx;
      background-color: var(--du-snackbar-primary);
      z-index: -1;
    }
  }
  &__action {
    color: var(--du-snackbar-primary);
    background-color: #fff;
  }
  &.revert-color {
    color: var(--du-snackbar-primary);
    background-color: var(--du-snackbar-secondary-bg);
  }
  &.revert-color &__action {
    color: #fff;
    background-color: var(--du-snackbar-primary);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
