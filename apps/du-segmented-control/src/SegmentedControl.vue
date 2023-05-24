<template>
  <div :class="[className, `du-segmented-control--${mode}`]" :style="style">
    <span
      :class="[
        'du-segmented-control__tab-item',
        tab.label === currentTab.label
          ? `du-segmented-control__tab-item--${mode}`
          : `du-segmented-control__tab-item--${mode}--unselected`,
      ]"
      v-for="(tab, index) in tabs"
      :key="index"
      @click.stop="handleTabTap(tab)"
    >
      {{ tab.label }}
    </span>
  </div>
</template>

<script>
import { defineComponent, computed, reactive, toRefs } from 'vue'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'
import DuIcon from '@frontend/du-icon/src/Icon.vue'

export default defineComponent({
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
    tabs: {
      type: Array,
      default: () => [],
    },
    mode: {
      type: String, // level1,level2,level3
      default: 'level1',
    },
    currentTab: {
      type: Object,
      default: null,
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
      return classNames('du-segmented-control', props.extClass)
    })

    const handleTabTap = (tab) => {
      if (tab.label === state.currentTab.label) return
      state.currentTab = tab
      emit('handleTabTap', tab)
    }
    return {
      ...toRefs(state),
      style,
      className,
      handleTabTap,
    }
  },
  emits: ['handleTabTap'],
})
</script>

<style lang="scss">
.du-segmented-control {
  display: -webkit-box;
  display: flex;
  align-items: center;
  padding: 4rpx;
  box-sizing: border-box;
  column-gap: 4rpx;
  overflow-x: auto;
  &--level1 {
    background: #f7f7f9;
    border: 2px solid rgba(0, 0, 0, 0.08);
    border-radius: 10rpx;
  }
  &--level3 {
    background: rgba(0, 0, 0, 0.24);
    box-shadow: inset 0px 4rpx 8rpx rgba(12, 12, 12, 0.1);
    border-radius: 10rpx;
  }
  &__tab-item {
    flex: 1;
    font-weight: 500;
    font-size: 32rpx;
    line-height: 64rpx;
    text-align: center;
    border-radius: 8rpx;
    flex-shrink: 0;
    white-space: nowrap;
    box-sizing: border-box;
    &--level1 {
      color: #000;
      background: #fff;
      border: 2rpx solid rgba(0, 0, 0, 0.08);
      box-shadow: 0px 2rpx 20rpx rgba(0, 0, 0, 0.08);
      padding: 0 32rpx;
      &--unselected {
        color: rgba(0, 0, 0, 0.4);
        background: transparent;
        padding: 0 32rpx;
      }
    }
    &--level2 {
      color: #fff;
      background: linear-gradient(92.37deg, #320091 0%, #815fbd 103.51%);
      &--unselected {
        color: rgba(0, 0, 0, 0.64);
        background: transparent;
      }
    }
    &--level3 {
      color: #fff;
      background: #8a75ff;
      box-shadow: 0px 1px 2px rgba(32, 36, 38, 0.15);
      &--unselected {
        color: #fff;
        background: transparent;
      }
    }
  }
}
::-webkit-scrollbar {
  display: none;
}
</style>
