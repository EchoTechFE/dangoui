<template>
  <div :class="className" :style="style">
    <img class="du-empty__img" :src="emptyImg" />
    <div class="du-empty__text">{{ text }}</div>
    <DuButton
      v-if="buttonText"
      type="secondary"
      @click="handleBtnClick"
      :extStyle="buttonStyle"
      >{{ buttonText }}</DuButton
    >
  </div>
</template>

<script>

import { computed } from 'vue'
import DuButton from '@frontend/du-button/src/Button.vue'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'

const EMPTY_IMGS = {
  networkError:
    'https://cdn.qiandaoapp.com/admins/289067294fdf43de41e1f996021c5d73.png',
  offline:
    'https://cdn.qiandaoapp.com/admins/c712b6f407895e52fcce0b92497ab557.png',
  serviceError:
    'https://cdn.qiandaoapp.com/admins/6359b06f0b089c2ce8cb26c9af6cb5c2.png',
  loadError:
    'https://cdn.qiandaoapp.com/admins/25e1cc3b209a3e8bea72a951c2a1149b.png',
  success:
    'https://cdn.qiandaoapp.com/admins/c5725e0cceb165232a7e7544302bb919.png',
  error:
    'https://cdn.qiandaoapp.com/admins/9ef7e8e31c6defd954932cb4015409d8.png',
  empty:
    'https://cdn.qiandaoapp.com/admins/438d469aaf9f771eaa3b2ffb054c2a68.png',
  searchEmpty:
    'https://cdn.qiandaoapp.com/admins/28c1ee429a239e8f8d4155c162d95e00.png',
  contentDeleted:
    'https://cdn.qiandaoapp.com/admins/efe2db4b53268df530806bcb70c787b0.png',
  contentInvisible:
    'https://cdn.qiandaoapp.com/admins/909f214c5c5d96143d5a238907a1b54d.png',
  notFound:
    'https://cdn.qiandaoapp.com/admins/a45c87c7e9beb5ef47cd81459afe6723.png',
}

export default {
  components: {
    DuButton,
  },

  props: {
    image: {
      type: String,
      default: '',
    },

    text: {
      type: String,
      default: '',
    },

    buttonText: {
      type: String,
      default: '',
    },

    extClass: {
      type: [String, Array, Object],
      default: '',
    },

    extStyle: {
      type: [String, Object],
      default: '',
    },
  },

  emits: ['buttonClick'],

  setup(props, { emit }) {
    const emptyImg = computed(() => {
      if (EMPTY_IMGS[props.image]) {
        return EMPTY_IMGS[props.image]
      }

      return props.image
    })

    const buttonStyle = computed(() => {
      if (typeof uni !== 'undefined') {
        return styleToCss({
          marginTop: '24rpx',
        })
      }

      return styleToCss({
        marginTop: Math.floor((24 / 750) * 100) + 'rem',
      })
    })

    const handleBtnClick = () => {
      emit('buttonClick')
    }

    const style = computed(() => {
      const { extStyle } = props
      return typeof extStyle === 'string'
        ? extStyle
        : styleToCss({
            ...extStyle,
          })
    })

    const className = computed(() => {
      return classNames('du-empty', props.extClass)
    })

    return {
      emptyImg,
      handleBtnClick,
      buttonStyle,
      style,
      className,
    }
  },
}
</script>

<style lang="scss">
.du-empty {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--du-empty-padding);

  &__img {
    width: 360rpx;
    height: 280rpx;
    margin-bottom: 24rpx;
  }

  &__text {
    font-size: 28rpx;
    color: rgba(32, 36, 38, 0.4);
  }
}
</style>
