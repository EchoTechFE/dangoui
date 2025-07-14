<template>
  <div class="du-card" :style="style" :class="className">
    <div class="du-card__header" v-if="showHeader">
      <div class="du-card__left">
        <div :class="['du-card__title', `du-card__title--${size}`]">
          {{ title }}
        </div>
        <slot name="left" />
        <div class="du-card__subtitle">{{ subtitle }}</div>
      </div>
      <div class="du-card__right">
        <slot name="right" />
        <div class="du-card__info" v-if="infoText" @click="$emit('infoTap')">
          <DuIcon :unsafe-internal="infoCircleIcon" :size="infoIconSize" />
          <div class="du-card__info-text">{{ infoText }}</div>
        </div>
        <div
          class="du-card__action"
          v-if="actionIcon"
          @click="$emit('actionTap')"
        >
          <DuIcon
            :unsafe-internal="actionIcon"
            :size="infoIconSize"
            color="#918B9F"
          />
        </div>
        <div class="du-card__guide" v-if="guideText" @click="handleGuideTap">
          <div class="du-card__guide-text">{{ guideText }}</div>
          <DuIcon
            :unsafe-internal="arrowHeavyRightIcon"
            :size="iconSize"
            color="rgba(0, 0, 0, 0.4)"
            :extStyle="arrowStyle"
          />
        </div>
      </div>
    </div>
    <div class="du-card__content" :style="finalContentStyle">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, normalizeStyle } from 'vue'
import DuIcon from '../icon/Icon.vue'
import { iconArrowHeavyRight, iconInfoCircle } from 'dangoui-icon-config'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle: string
    guideText: string
    infoText: string
    actionIcon: string | { _: string }
    mode: 'normal' | 'collapse'
    size: 'normal' | 'large'
    defaultOpen: boolean | null
    open: boolean | null
    extClass: string | string[] | Record<string, boolean>
    extStyle:
      | string
      | {
          [x: string]: string | number
        }
    contentStyle:
      | string
      | {
          [x: string]: string | number
        }
    showHeader: boolean
  }>(),
  {
    title: '',
    subtitle: '',
    guideText: '查看更多',
    infoText: '',
    actionIcon: '',
    mode: 'normal',
    size: 'normal',
    defaultOpen: null,
    open: null,
    extClass: '',
    extStyle: '',
    contentStyle: '',
    showHeader: true,
  },
)

const emit = defineEmits<{
  (e: 'guideTap'): void
  (e: 'infoTap'): void
  (e: 'actionTap'): void
  (e: 'toggleOpen', open: boolean): void
}>()

const iconSize = ((16 * 100) / 750).toFixed(4) + 'vw'

const infoIconSize = ((24 * 100) / 750).toFixed(4) + 'vw'

const arrowHeavyRightIcon = (function () {
  if (__WEB__) {
    return iconArrowHeavyRight
  }
  return 'arrow-heavy-right'
})()

const infoCircleIcon = (function () {
  if (__WEB__) {
    return iconInfoCircle
  }
  return 'info-circle'
})()

const style = computed(() => {
  const { extStyle } = props
  return normalizeStyle(extStyle)
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

const finalContentStyle = computed(() => {
  const defaultStyle: Record<string, string> = {
    display: realOpen ? 'block' : 'none',
  }

  if (!props.showHeader) {
    defaultStyle.paddingTop = `${(24 * 100) / 750}vw`
  }

  return normalizeStyle([defaultStyle, props.contentStyle])
})
</script>
