<template>
  <div
    class="du-steps"
    :style="style"
    :class="className"
  >
    <div
      class="du-steps__step-wrapper"
      v-for="(step, idx) in fulfilledSteps"
      :key="step.title"
      :style="{
        flex: idx === fulfilledSteps.length - 1 ? 'none' : '1',
        justifyContent: 'flex-start',
      }"
    >
      <div class="du-steps__step">
        <div
          v-if="step.type === 'before'"
          class="du-steps__before"
        >
          <Check :type="type === 'opacity' ? 'main': 'default'" />
        </div>
        <div
          v-else-if="step.type === 'process'"
          class="du-steps__process"
        >
          <div class="du-steps__process-inner" />
        </div>
        <div
          v-else-if="step.type === 'after'"
          class="du-steps__after"
        />
        <div :class="step.textClassName">
          {{ step.title }}
        </div>
        <div
          v-if="idx > 0"
          :class="['du-steps__line du-steps__line--left', activeIndex > idx - 1 ? `du-steps__line--active` : '']"
        />
        <div
          v-if="idx < fulfilledSteps.length - 1"
          :class="['du-steps__line du-steps__line--right', activeIndex > idx ? `du-steps__line--active` : '']"
        />
      </div>
      <div
        :class="['du-steps__ab-line du-steps__ab-line--right', activeIndex > idx ? `du-steps__ab-line--active` : '']"
        v-if="idx < fulfilledSteps.length - 1"
      />
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import classNames from 'classnames'
import styleToCss from 'style-object-to-css-string'
import Check from './Check.vue'

export default {
  components: {
    Check
  },

  props: {
    extClass: {
      type: [String, Array, Object],
      default: ''
    },

    extStyle: {
      type: [String, Object],
      default: ''
    },

    activeIndex: {
      type: Number,
      default: 0
    },

    // process 暂时用不到 status
    status: {
      type: String,
      default: 'process'
    },

    // [{ title: '标题' }]
    steps: {
      type: Array,
      default () {
        return []
      }
    },

    type: {
      type: String,
      // default | ghost
      default: 'default'
    }
  },

  setup (props) {
    const fulfilledSteps = computed(() => {
      // TODO: 简单实现，满足大部分场景，后面再改
      const maxLength = Math.max(...props.steps.map(item => item.title.length))

      return props.steps.map((item, idx) => {
        let type = 'before'
        if (idx < props.activeIndex) {
          type = 'before'
        }
        if (idx === props.activeIndex) {
          type = props.status === 'process' ? 'process' : 'before'
        }
        if (idx > props.activeIndex) {
          type = 'after'
        }

        let title = item.title
        const extra = maxLength - item.title.length
        if (extra > 0) {
          title = Array(extra).fill('\xa0').join('') + title + Array(extra).fill('\xa0').join('')
        }

        return {
          ...item,
          title,
          type,
          textClassName: classNames('du-steps__text', `du-steps__text-${type}`)
        }
      })
    })

    const style = computed(() => {
      const { extStyle } = props
      return typeof extStyle === 'string'
        ? extStyle
        : styleToCss({
          ...extStyle
        })
    })

    const className = computed(() => {
      const { extClass } = props
      if (props.type === 'ghost') {
        return classNames('du-steps-theme-opacity', extClass)
      }
      return extClass
    })

    return {
      fulfilledSteps,
      style,
      className
    }
  }
}
</script>

<style lang="scss">
.du-steps {
  width: 100%;
  display: flex;
  overflow: hidden;
  position: relative;

  &__step {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1000;
    position: relative;
  }

  &__step-wrapper {
    flex: 1;
    display: flex;
    position: relative;
    overflow: hidden;
  }

  &__before {
    border-radius: 28rpx;
    width: 28rpx;
    height: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--du-steps-primary);
    background-size: contain;
    z-index: 1000;
  }

  &__process {
    border-radius: 28rpx;
    width: 28rpx;
    height: 28rpx;
    background-color: var(--du-steps-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  &__after {
    width: 16rpx;
    height: 16rpx;
    border-radius: 16rpx;
    background-color: var(--du-steps-sub);
    margin-top: 6rpx;
    margin-bottom: 6rpx;
    z-index: 1000;
  }

  &__process-inner {
    width: 12rpx;
    height: 12rpx;
    border-radius: 12rpx;
    background-color: var(--du-steps-circle-inner-color);
  }

  &__text {
    width: 100%;
    text-align: center;
    white-space: nowrap;
  }

  &__text-before {
    font-size: 24rpx;
    margin-top: 16rpx;
    color: var(--du-steps-text-color);
  }

  &__text-process {
    font-size: 24rpx;
    margin-top: 16rpx;
    color: var(--du-steps-text-color);
    font-weight: 500;
  }

  &__text-after {
    font-size: 24rpx;
    margin-top: 16rpx;
    color: var(--du-steps-text-sub-color);
  }

  &__line {
    position: absolute;
    height: 4rpx;
    background: var(--du-steps-line-color);
    width: 50%;
    top: 12rpx;

    &--active {
      background: var(--du-steps-line-active-color);
    }

    &--left {
      left: 0;
    }

    &--right {
      right: 0;
    }
  }

  &__ab-line {
    height: 4rpx;
    background: var(--du-steps-line-color);
    margin-top: 12rpx;
    flex: 1 1 auto;

    &--active {
      background: var(--du-steps-line-active-color);
    }

    &--right {
      right: 0;
    }
  }
}
</style>
