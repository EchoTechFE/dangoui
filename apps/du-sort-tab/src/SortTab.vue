<template>
  <div :class="[className, `du-sort-tab--${mode}`]" :style="style">
    <DuIcon
      v-if="mode === 'level1'"
      name="search"
      color="#918B9F"
      size="20px"
      extStyle="margin-right: 16px; transform: translateY(3px);"
      @click.stop="handleSearchTap"
    />
    <div :class="['du-sort-tab__left', `du-sort-tab__left--${mode}`]">
      <span
        :class="[
          'du-sort-tab__left__tab-item',
          `du-sort-tab__left__tab-item--${mode}`,
          currentTab.label === tab.label
            ? `du-sort-tab__left__tab-item--${mode}--selected`
            : `du-sort-tab__left__tab-item--${mode}--unselected`,
          index !== tabs.length - 1 ? `du-sort-tab__left__tab-item--${mode}--line` : '',
        ]"
        v-for="(tab, index) in tabs"
        :key="index"
        @click.stop="handleTabTap(tab)"
      >
        {{ tab.label }}
      </span>
    </div>
    <div :class="['du-sort-tab__right', `du-sort-tab__right--${mode}`]" v-if="options.length > 0">
      <img
        src="https://cdn.qiandaoapp.com/interior/images/dedd52b806c5ac81b391948056be57f7.png"
        alt=""
        class="du-sort-tab__right__shadow"
      />
      <span
        :class="[
          'du-sort-tab__right__item',
          { 'du-sort-tab__right__item--line': index !== options.length - 1 },
        ]"
        v-for="(option, index) in options"
        :key="index"
        @click.stop="handleOptionTap(option)"
      >
        {{ option.label }}
        <DuIcon name="sort" color="#918B9F" size="12" extStyle="margin-left: 2px;" />
      </span>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, toRefs, reactive } from 'vue'
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
    options: {
      type: Array,
      default: () => [],
    },
    mode: {
      type: String, // level1,level2,level3,level4
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
      return classNames('du-sort-tab', props.extClass)
    })

    const handleTabTap = (tab) => {
      if (tab.label === state.currentTab.label) return
      state.currentTab = tab
      emit('handleTabTap', tab)
    }

    const handleOptionTap = (option) => {
      emit('handleOptionTap', option)
    }

    const handleSearchTap = () => {
      emit('handleSearchTap')
    }
    return {
      ...toRefs(state),
      style,
      className,
      handleTabTap,
      handleOptionTap,
      handleSearchTap,
    }
  },
  emits: ['handleTabTap', 'handleOptionTap', 'handleSearchTap'],
})
</script>

<style lang="scss">
.du-sort-tab {
  display: flex;
  align-items: center;
  font-size: 0;
  padding: 0 0 0 30rpx;
  &--level1,
  &--level2,
  &--level3 {
    background: #fff;
  }
  &__left {
    display: flex;
    align-items: center;
    overflow-x: auto;
    &--level1,
    &--level2 {
      column-gap: 40rpx;
      padding-right: 20rpx;
    }
    &--level3 {
      column-gap: 16rpx;
      padding-top: 10rpx;
      padding-bottom: 10rpx;
      padding-right: 8rpx;
    }
    &--level4 {
      column-gap: 50rpx;
      padding-right: 25rpx;
    }
    &__tab-item {
      position: relative;
      white-space: nowrap;
      box-sizing: border-box;
      &--level1 {
        font-size: 32rpx;
        line-height: 48rpx;
        padding-top: 24rpx;
        padding-bottom: 16rpx;
        &--selected {
          color: #000;
          font-weight: 500;
          &::after {
            position: absolute;
            bottom: 2rpx;
            left: 50%;
            display: block;
            width: 40rpx;
            height: 8rpx;
            background: var(--du-sort-tab-item-selected-bottom-line-color);
            margin-left: -23rpx;
            border-radius: 8rpx 2rpx 8rpx 2rpx;
            content: '';
            transition: all 0.5s;
          }
        }
        &--unselected {
          color: var(--du-sort-tab-item-unselect-color);
          &::after {
            width: 0;
            content: '';
          }
        }
      }
      &--level2 {
        font-size: 28rpx;
        line-height: 44rpx;
        &--selected {
          font-weight: 500;
          color: #000;
          padding-top: 12rpx;
          padding-bottom: 12rpx;
          &::after {
            position: absolute;
            bottom: 2rpx;
            left: 50%;
            display: block;
            width: 40rpx;
            height: 8rpx;
            background: var(--du-sort-tab-item-selected-bottom-line-color);
            margin-left: -22rpx;
            border-radius: 8rpx 2rpx 8rpx 2rpx;
            content: '';
            transition: all 0.5s;
          }
        }
        &--unselected {
          color: var(--du-sort-tab-item-unselect-color);
          &::after {
            width: 0;
            content: '';
          }
        }
      }
      &--level3 {
        padding: 0 16rpx;
        font-size: 24rpx;
        line-height: 48rpx;
        &--selected {
          background: #f2f0ff;
          border-radius: 4rpx;
          color: var(--du-sort-tab-item-selected-color);
        }
        &--unselected {
          color: var(--du-sort-tab-item-unselect-color);
          background: #f7f7f9;
          border-radius: 4rpx;
        }
      }
      &--level4 {
        position: relative;
        padding: 0 16rpx;
        font-size: 24rpx;
        line-height: 36rpx;
        &--line {
          &::after {
            position: absolute;
            top: 7rpx;
            right: -24rpx;
            display: block;
            width: 2rpx;
            height: 24rpx;
            background: var();
            content: '';
          }
        }
        &--selected {
          color: var(--du-sort-tab-item-selected-color);
        }
        &--unselected {
          color: var(--du-sort-tab-item-unselect-color);
        }
      }
    }
  }
  &__right {
    position: relative;
    display: flex;
    align-items: center;
    padding: 16rpx 30rpx 16rpx;
    background: #fff;
    column-gap: 34rpx;
    &__shadow {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 2rpx;
      height: 67rpx;
    }
    &--level1 {
      padding: 30rpx 30rpx 16rpx !important;
    }
    &__item {
      position: relative;
      display: flex;
      align-items: center;
      font-weight: 500;
      font-size: 24rpx;
      line-height: 36rpx;
      color: rgba(0, 0, 0, 0.4);
      white-space: nowrap;
      &--line {
        &::after {
          position: absolute;
          top: 5rpx;
          right: -20rpx;
          display: block;
          width: 2rpx;
          height: 24rpx;
          background: var(--du-sort-tab-item-divide-color);
          content: '';
        }
      }
    }
  }
}
::-webkit-scrollbar {
  display: none;
}
</style>
