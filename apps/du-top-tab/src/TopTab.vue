<template>
  <div :class="[className, `du-top-tab--${mode}`]" :style="style">
    <div class="du-top-tab__left">
      <span
        :class="[
          'du-top-tab__left__item',
          `du-top-tab__left__item--${mode}`,
          tab.label === currentTab.label
            ? `du-top-tab__left__item--${mode}--selected`
            : `du-top-tab__left__item--${mode}--unselected`,
        ]"
        v-for="(tab, index) in tabs"
        :key="index"
        @click.stop="handleTabTap(tab)"
      >
        {{ tab.label }}
      </span>
    </div>
    <div class="du-top-tab__right" v-if="mode === 'level1'" @click="handleChannelTap">
      <img
        class="du-top-tab__right__shadow"
        src="https://cdn.qiandaoapp.com/interior/images/22a4648695ac1bc084d123a168dc31b9.png"
        alt=""
      />
      <img
        class="du-top-tab__right__icon"
        src="https://cdn.qiandaoapp.com/ued/10fb6c2a56579c3d36e243bc35b970e0.png"
        alt=""
      />
      频道
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, toRefs, reactive } from 'vue'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'

export default defineComponent({
  components: {},
  props: {
    extClass: {
      type: [String, Array, Object],
      default: '',
    },
    extStyle: {
      type: [String, Object],
      default: '',
    },
    tabs: {
      type: Array,
      default: () => [],
    },
    mode: {
      type: String, // level1,level2,
      default: 'level1',
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      currentTab: props.currentTab || props.tabs?.[0],
    })
    const style = computed(() => {
      const { extStyle } = props
      return typeof extStyle === 'string'
        ? extStyle
        : styleToCss({
            ...extStyle,
          })
    })

    const className = computed(() => {
      return classNames('du-top-tab', props.extClass)
    })

    const handleTabTap = (tab) => {
      if (tab.label === state.currentTab.label) return
      state.currentTab = tab
      emit('handleTabTap', tab)
    }

    const handleChannelTap = () => {
      emit('handleChannelTap')
    }

    return {
      ...toRefs(state),
      style,
      className,
      handleTabTap,
      handleChannelTap,
    }
  },
  emits: ['handleTabTap', 'handleChannelTap'],
})
</script>

<style lang="scss">
.du-top-tab {
  display: flex;
  align-items: center;
  font-size: 0;
  &--level1 {
    background: #fff;
    padding: 0 0 0 30rpx;
  }
  &--level2 {
    background: #ff812c;
    padding: 0 0 0 24rpx;
  }
  &__left {
    display: flex;
    align-items: center;
    column-gap: 40rpx;
    overflow-x: auto;
    &__item {
      font-size: 36rpx;
      white-space: nowrap;
      &--level1 {
        position: relative;
        line-height: 86rpx;
        &:last-child {
          margin-right: 30rpx;
        }
        &--selected {
          font-weight: 500;
          color: #000000;
          &::after {
            position: absolute;
            bottom: 2rpx;
            left: 50%;
            display: block;
            width: 50rpx;
            height: 10rpx;
            background: var(--du-top-tab-item-selected-bottom-line-color);
            margin-left: -25rpx;
            border-radius: 10rpx 2rpx 10rpx 2rpx;
            content: '';
            transition: all 0.5s;
          }
        }
        &--unselected {
          color: var(--du-top-tab-item-unselect-color);
          &::after {
            width: 0;
            content: '';
          }
        }
      }
      &--level2 {
        position: relative;
        line-height: 88rpx;
        &:last-child {
          margin-right: 24rpx;
        }
        &--selected {
          font-weight: 500;
          color: #fff;
          &::after {
            position: absolute;
            bottom: 6rpx;
            left: 50%;
            display: block;
            width: 31rpx;
            height: 11rpx;
            background-image: url(https://cdn.qiandaoapp.com/interior/images/701f576909b0db06fc78b713f3044784.png);
            background-size: 100% 100%;
            margin-left: -15.5rpx;
            content: '';
          }
        }
        &--unselected {
          color: rgba(255, 255, 255, 0.88);
        }
      }
    }
  }
  &__right {
    position: relative;
    display: flex;
    align-items: center;
    line-height: 86rpx;
    font-size: 32rpx;
    color: var(--du-top-tab-item-unselect-color);
    column-gap: 8rpx;
    white-space: nowrap;
    &__shadow {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 2rpx;
      height: 56rpx;
    }
    &__icon {
      width: 32rpx;
      height: 32rpx;
      padding: 0 16rpx;
    }
  }
}
::-webkit-scrollbar {
  display: none;
}
</style>
