<template>
  <button
    :class="className"
    :style="style"
    hoverClass=""
    :openType="openType"
    @getuserinfo="onGetUserInfo"
    @click="onClick"
  >
    <div v-if="loading" class="du-button__icon du-button__loading" />
    <template v-if="iconPosition === 'left' && icon">
      <div v-if="isIconC" class="du-button__icon">
        <DuIcon :name="icon" />
      </div>
      <img v-else class="du-button__icon" :src="icon" alt="du-button-icon" />
    </template>
    <slot>
      {{ text }}
    </slot>
    <template v-if="iconPosition === 'right' && icon">
      <div v-if="isIconC" class="du-button__icon du-button__icon--right">
        <DuIcon :name="icon" />
      </div>
      <img v-else class="du-button__icon du-button__icon--right" :src="icon" alt="du-button-icon" />
    </template>
  </button>
</template>

<script>
import { computed } from '@vue/composition-api'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'

import DuIcon from '@frontend/du-icon/src/Icon.vue'
import IconConfig from '@frontend/du-icon/src/iconfont-config.json'

function findIcon(name) {
  return Object.keys(IconConfig.icons).find((i) => {
    if (i === name) {
      return true
    }
    if (name.indexOf('_') > -1) {
      if (i === name.replace(/_/g, '-')) {
        return true
      }
    }
    return false
  })
}

export default {
  components: {
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
    type: {
      type: String,
      default: 'primary',
    },
    size: {
      type: String,
      default: 'normal',
    },
    text: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    iconPosition: {
      type: String,
      default: 'left',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    full: {
      type: Boolean,
      default: false,
    },
    square: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    openType: {
      type: String,
      default: '',
    },
    ghost: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const className = computed(() => {
      const { size, type, ghost, loading, full, square, disabled, extClass } = props
      return classNames(
        ['du-button', 'du-button--' + size, 'du-button--' + type],
        {
          'du-button--disabled': disabled,
          'du-button--ghost': ghost,
          'du-button--loading': loading,
          'du-button--full': full,
          'du-button--square': square,
        },
        extClass,
      )
    })

    const style = computed(() => {
      const { extStyle } = props
      return typeof extStyle === 'string'
        ? extStyle
        : styleToCss({
            ...extStyle,
          })
    })

    const isIconC = computed(() => !!findIcon(props.icon))

    function onClick() {
      if (!props.disabled && !props.loading) {
        emit('click')
      }
    }

    function onGetUserInfo(...args) {
      emit('getUserInfo', ...args)
    }

    return { style, className, isIconC, onClick, onGetUserInfo }
  },
}
</script>

<style lang="scss">
@mixin typeTheme($type) {
  color: var(--du-bt- + $type + -color);

  background: var(--du-bt- + $type + -bg);
  border: var(--du-bt- + $type + -border);
}
.du-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-weight: 600;

  border-radius: 40rpx;

  &__icon {
    display: inline-block;
  }

  &__loading {
    background-image: url("data:image/svg+xml;charset=utf8, %3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 100 100'%3E%3Cpath fill='none' d='M0 0h100v100H0z'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23E9E9E9' rx='5' ry='5' transform='translate(0 -30)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23989697' rx='5' ry='5' transform='rotate(30 105.98 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%239B999A' rx='5' ry='5' transform='rotate(60 75.98 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23A3A1A2' rx='5' ry='5' transform='rotate(90 65 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23ABA9AA' rx='5' ry='5' transform='rotate(120 58.66 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23B2B2B2' rx='5' ry='5' transform='rotate(150 54.02 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23BAB8B9' rx='5' ry='5' transform='rotate(180 50 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23C2C0C1' rx='5' ry='5' transform='rotate(-150 45.98 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23CBCBCB' rx='5' ry='5' transform='rotate(-120 41.34 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23D2D2D2' rx='5' ry='5' transform='rotate(-90 35 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23DADADA' rx='5' ry='5' transform='rotate(-60 24.02 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23E2E2E2' rx='5' ry='5' transform='rotate(-30 -5.98 65)'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: cover;

    animation: du-button-laoding 1s steps(12, end) infinite;
  }

  &--large {
    height: 80rpx;
    padding: 0 32rpx;

    font-size: 28rpx;
    & > .du-button__icon {
      width: 40rpx;
      height: 40rpx;
      --du-icon-fz: 40rpx;
      margin-right: 16rpx;
      &--right {
        margin-right: 0;
        margin-left: 16rpx;
      }
    }
  }
  &--medium {
    height: 72rpx;
    padding: 0 28rpx;

    font-size: 28rpx;
    & > .du-button__icon {
      width: 32rpx;
      height: 32rpx;
      --du-icon-fz: 32rpx;
      margin-right: 12rpx;
      &--right {
        margin-right: 0;
        margin-left: 12rpx;
      }
    }
  }
  &--normal {
    height: 64rpx;
    padding: 0 28rpx;

    font-size: 28rpx;
    & > .du-button__icon {
      width: 32rpx;
      height: 32rpx;
      --du-icon-fz: 32rpx;
      margin-right: 12rpx;
      &--right {
        margin-right: 0;
        margin-left: 12rpx;
      }
    }
  }
  &--small {
    height: 56rpx;
    padding: 0 24rpx;

    font-size: 24rpx;
    & > .du-button__icon {
      width: 24rpx;
      height: 24rpx;
      --du-icon-fz: 24rpx;
      margin-right: 8rpx;
      &--right {
        margin-right: 0;
        margin-left: 8rpx;
      }
    }
  }
  &--mini {
    height: 48rpx;
    padding: 0 20rpx;

    font-size: 24rpx;
    line-height: 48rpx;
    & > .du-button__icon {
      width: 24rpx;
      height: 24rpx;
      --du-icon-fz: 24rpx;
      margin-right: 8rpx;
      &--right {
        margin-right: 0;
        margin-left: 8rpx;
      }
    }
  }

  &--primary {
    @include typeTheme('primary');
    &.du-button--ghost {
      color: #202426;

      background: #fff;
      border: none;
    }
  }
  &--secondary {
    @include typeTheme('secondary');
    &.du-button--ghost {
      color: #fff;

      background: rgba(255, 255, 255, 0.1);
      border: none;
    }
  }
  &--recommend {
    @include typeTheme('recommend');
    &.du-button--ghost {
      color: #fff;

      background: transparent;
      border: 1px solid #fff;
    }
  }
  &--info {
    @include typeTheme('info');
    &.du-button--ghost {
      color: rgba(255, 255, 255, 0.4);

      background: rgba(255, 255, 255, 0.1);
      border: none;
    }
  }
  &--text {
    @include typeTheme('text');
    padding: 0;

    background: none !important;

    border: none;
    border-radius: 0;
    &.du-button--ghost {
      color: #fff;
    }
  }
  &--text-primary {
    @include typeTheme('text-primary');
    padding: 0;

    background: none !important;
    border: none;
    border-radius: 0;
  }

  &--full {
    width: 100%;
  }

  &--square {
    border-radius: 16rpx;
  }

  &--loading {
    opacity: 0.6;
  }

  &--disabled {
    @include typeTheme('disabled');
    &.du-button--ghost {
      color: rgba(255, 255, 255, 0.5);

      background: rgba(255, 255, 255, 0.2);
      border: none;
    }
  }
}

@keyframes du-button-laoding {
  0% {
    transform: rotate3d(0, 0, 1, 0deg);
  }
  100% {
    transform: rotate3d(0, 0, 1, 360deg);
  }
}
</style>
