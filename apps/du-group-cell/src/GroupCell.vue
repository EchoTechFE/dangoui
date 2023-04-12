<template>
  <div class="du-group-cell" :style="style" :class="className">
    <div class="du-group-cell__header">
      <div class="du-group-cell__left">
        <div class="du-group-cell__title">{{ title }}</div>
        <slot name="left" />
        <div class="du-group-cell__subtitle">{{ subtitle }}</div>
      </div>
      <div class="du-group-cell__right">
        <slot name="right" />
        <div class="du-group-cell__info" v-if="infoText" @click="$emit('infoTap')">
          <DuIcon name="info-circle" :size="infoIconSize" />
          <div class="du-group-cell__info-text">{{ infoText }}</div>
        </div>
        <div class="du-group-cell__action" v-if="actionIcon" @click="$emit('actionTap')">
          <DuIcon :name="actionIcon" :size="infoIconSize" color="#918B9F" />
        </div>
        <div class="du-group-cell__guide" v-if="guideText" @click="handleGuideTap">
          <div class="du-group-cell__guide-text">{{ guideText }}</div>
          <DuIcon
            name="arrow-heavy-right"
            :size="iconSize"
            color="rgba(0, 0, 0, 0.4)"
            :extStyle="arrowStyle"
          />
        </div>
      </div>
    </div>
    <div class="du-group-cell__content" :style="{ display: realOpen ? 'block' : 'none' }">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import DuIcon from '@frontend/du-icon/src/Icon.vue'
import styleToCss from 'style-object-to-css-string'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },

  subtitle: {
    type: String,
    default: '',
  },

  guideText: {
    type: String,
    default: '查看更多',
  },

  infoText: {
    type: String,
    default: '',
  },

  actionIcon: {
    type: String,
    default: '',
  },

  // normal | collapse
  mode: {
    type: String,
    default: 'normal',
  },

  size: {
    type: String,
    // normal | large
    default: 'normal',
  },

  defaultOpen: {
    type: Boolean,
    default: null,
  },

  open: {
    type: Boolean,
    default: null,
  },

  extClass: {
    type: [String, Array, Object],
    default: '',
  },

  extStyle: {
    type: [String, Object],
    default: '',
  },
})

const emit = defineEmits(['guideTap', 'infoTap', 'actionTap', 'toggleOpen'])

const iconSize = ((16 * 100) / 750).toFixed(4) + 'vw'

const infoIconSize = ((24 * 100) / 750).toFixed(4) + 'vw'

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

  return extClass
})

const innerOpen = ref(true)

if (props.defaultOpen != null) {
  innerOpen.value = props.defaultOpen
}

const realOpen = computed(() => {
  if (props.mode !== 'collapse') {
    return true
  }

  if (props.open != null) {
    return props.open
  }

  return innerOpen.value
})

const handleGuideTap = () => {
  if (props.mode === 'collapse') {
    emit('toggleOpen', !realOpen.value)
    if (props.open == null) {
      innerOpen.value = !realOpen.value
    }
  } else {
    emit('guideTap')
  }
}

const arrowStyle = computed(() => {
  if (props.mode === 'collapse') {
    return `transform: rotate(${realOpen.value ? '90' : '0'}deg)`
  }
  return ''
})
</script>

<style lang="scss">
.du-group-cell {
  box-sizing: border-box;
  width: 730rpx;
  padding: 24rpx;
  background: #fff;
  margin: 0 10rpx;
  border-radius: 8rpx;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__left {
    display: flex;
    align-items: center;
  }

  &__right {
    display: flex;
    align-items: center;
  }

  &__guide {
    display: flex;
    align-items: center;
    margin-left: 16rpx;
  }

  &__title {
    font-size: 28rpx;
    font-weight: 500;
    margin-right: 16rpx;

    &--large {
      font-size: 32rpx;
    }
  }

  &__subtitle {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.4);
  }

  &__guide-text {
    font-weight: 500;
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.4);
    margin-right: 4rpx;
  }

  &__info {
    display: flex;
    align-items: center;
    margin-left: 16rpx;
  }

  &__action {
    margin-left: 16rpx;
  }

  &__info-text {
    margin-left: 8rpx;
    font-weight: 500;
    font-size: 24rpx;
    color: #2b263b;
  }

  &__content {
    margin-top: 16rpx;
  }
}
</style>
