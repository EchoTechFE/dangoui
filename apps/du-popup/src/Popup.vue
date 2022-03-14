<template>
  <div class="du-popup" v-if="innerVisible">
    <div :class="maskClassName" @click="handleMaskClick" />
    <div :style="style" :class="className">
      <div class="du-popup__header">
        <div class="du-popup__title">{{ title }}</div>
        <div class="du-popup__close" @click="handleClose" />
      </div>
      <slot />
    </div>
  </div>
</template>

<script>
import { computed, watch, ref } from '@vue/composition-api'
import classNames from 'classnames'
import styleToCss from 'style-object-to-css-string'

export default {
  props: {
    title: {
      type: String,
      default: '',
    },

    type: {
      // top | bottom | center
      type: String,
      default: 'center',
    },

    visible: {
      type: Boolean,
      default: false,
    },

    extClass: {
      type: [String, Array, Object],
      default: '',
    },

    extStyle: {
      type: [String, Object],
      default: '',
    },

    maskClick: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const innerVisible = ref(props.visible)
    const openAni = ref(false)

    const style = computed(() => {
      const { extStyle } = props
      return typeof extStyle === 'string'
        ? extStyle
        : styleToCss({
            ...extStyle,
          })
    })

    const className = computed(() => {
      const { extClass } = props

      return classNames('du-popup__content', extClass, {
        [`du-popup--${props.type}`]: true,
        [`du-popup--${props.type}-open`]: openAni.value,
      })
    })

    const maskClassName = computed(() => {
      return classNames('du-popup__mask', {
        'du-popup__mask--open': openAni.value,
      })
    })

    const handleMaskClick = () => {
      if (props.maskClick) {
        emit('update:visible', false)
        emit('close')
      }
    }

    const handleClose = () => {
      emit('update:visible', false)
      emit('close')
    }

    watch(
      () => props.visible,
      (val) => {
        if (val) {
          innerVisible.value = val
        } else {
          setTimeout(() => {
            innerVisible.value = props.visible
          }, 400)
        }

        if (val) {
          // 延迟一下，然后开始动画
          setTimeout(() => {
            // 确保执行动画的时候，是打开的
            if (props.visible) {
              openAni.value = true
            }
          }, 100)
        } else {
          // 马上开始动画
          openAni.value = false
        }
      },
      {
        immediate: true,
      },
    )

    return {
      innerVisible,
      style,
      className,
      maskClassName,
      handleMaskClick,
      handleClose,
    }
  },
}
</script>

<style lang="scss">
.du-popup {
  &__mask {
    background-color: rgba(32, 36, 38, 0.6);
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    transition: all 0.3s;

    &--open {
      opacity: 1;
    }
  }

  &__content {
    background-color: #fff;
    position: fixed;
    transition: all 0.3s;
  }

  &--bottom {
    border-radius: 30rpx 30rpx 0 0;
    width: 100vw;
    bottom: 0;
    left: 0;
    right: 0;
    padding-bottom: 0rpx;
    padding-bottom: calc(0rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(0rpx + env(safe-area-inset-bottom));
    transform: translateY(100%);
  }

  &--bottom-open {
    transform: translateY(0);
  }

  &--center {
    border-radius: 30rpx;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0);
  }

  &--center-open {
    transform: translate(-50%, -50%) scale(1);
  }

  &__header {
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    color: #202426;
    font-size: 32rpx;
    font-weight: bold;
  }

  &__close {
    background-image: url(https://cdn.qiandaoapp.com/admins/69ff82160144b481dbd58958cd66172b.png);
    background-size: contain;
    background-repeat: no-repeat;
    width: 32rpx;
    height: 32rpx;
  }
}
</style>
