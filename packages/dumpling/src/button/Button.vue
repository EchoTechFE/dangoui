<template>
  <button
    :id="buttonId"
    :class="className"
    :style="style"
    hoverClass=""
    :openType="openType"
    @getuserinfo="onGetUserInfo"
    @click="onClick"
    @touchstart="onStart"
    @touchend="onEnd"
  >
    <div
      v-if="loading"
      :class="`du-button__icon du-button__icon--${size} du-button__loading`"
    />
    <template v-if="iconPosition === 'left' && icon">
      <div v-if="isIconC" :class="`du-button__icon du-button__icon--${size}`">
        <DuIcon :name="icon" :size="iconSize" />
      </div>
      <img
        v-else
        :class="`du-button__icon du-button__icon--${size}`"
        :src="icon"
        alt="du-button-icon"
      />
    </template>
    <slot>
      {{ text }}
    </slot>
    <template v-if="iconPosition === 'right' && icon">
      <div
        v-if="isIconC"
        :class="`du-button__icon du-button__icon--${size} du-button__icon--${size}-right`"
      >
        <DuIcon :name="icon" :size="iconSize" />
      </div>
      <img
        v-else
        :class="`du-button__icon du-button__icon--${size} du-button__icon--${size}-right`"
        :src="icon"
        alt="du-button-icon"
      />
    </template>
    <div v-if="arrowRight" class="du-button__arrow-right">
      <DuIcon name="arrow-heavy-right" :size="iconSize" />
    </div>

    <div
      v-if="press && isPress"
      class="du-button__press"
      :style="{
        background: pressBackground,
      }"
    />
  </button>
</template>

<script setup lang="ts">
import { computed, ref, normalizeStyle, normalizeClass } from 'vue'
import DuIcon from '../icon/Icon.vue'
import iconConfig from '../icon/iconfont-config.json'

const props = withDefaults(
  defineProps<{
    /**
     * 主题
     */
    theme?: string
    /**
     * id 属性，可用 CSS id 选择器获取到对应组件
     */
    buttonId: string
    /**
     * 自定义 class
     */
    extClass: string | string[] | Record<string, boolean>
    /**
     * 自定义 style
     */
    extStyle:
      | string
      | {
          [x: string]: string | number
        }
    /**
     * 色彩
     */
    color: string
    /**
     * 按钮类型
     */
    type: 'primary' | 'secondary' | 'outline' | 'text'
    /**
     * 按钮大小
     */
    size: 'mini' | 'small' | 'normal' | 'medium' | 'large'
    /**
     * 按钮文本
     */
    text: string
    /**
     * 按钮附带图标
     */
    icon: string
    /**
     * 图标大小
     */
    iconSize: string
    /**
     * 图标位置
     */
    iconPosition: 'left' | 'right'
    /**
     * 按钮右侧箭头
     */
    arrowRight: boolean
    /**
     * 是否禁用状态
     */
    disabled: boolean
    /**
     * 临时禁用还是永久禁用
     */
    disabledType: 'default' | 'temp'
    /**
     * 全宽
     */
    full: boolean
    /**
     * 加载中
     */
    loading: boolean
    /**
     * 小程序 [open-type](https://developers.weixin.qq.com/miniprogram/dev/component/button.html)
     * @available weixin
     */
    openType: string
    /**
     * 点击触发事件改为长按
     */
    press: boolean
    /**
     * 长按时候背景
     */
    pressBackground: string
  }>(),
  {
    buttonId: '',
    extClass: '',
    extStyle: () => ({}),
    color: 'primary',
    type: 'primary',
    size: 'normal',
    text: '',
    icon: '',
    iconSize: '',
    iconPosition: 'left',
    arrowRight: false,
    disabled: false,
    disabledType: 'default',
    full: false,
    loading: false,
    openType: '',
    ghost: false,
    press: false,
    pressBackground: 'rgba(0, 0, 0, 0.04)',
  },
)

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'getUserInfo', ...args: any[]): void
}>()

function findIcon(name: string) {
  return Object.keys(iconConfig.icons).find((i) => {
    if (i === name) {
      return true
    }
    if (name.indexOf('_') > -1) {
      if (i === name.replace(/_/g, '-')) {
        return true
      }
    }

    // TODO: 下个版本替换了删掉
    const map: Record<string, string> = {
      attention: 'attention-circle',
      question: 'question-circle',
      complete: 'complete-circle',
      'complete-filled': 'complete-circle-filled',
      accountpay: 'accountpay-circle-filled',
    }

    if (map[name]) {
      return true
    }

    return false
  })
}

const isPress = ref(false)
const pressStart = ref(0)

const className = computed(() => {
  const { size, type, loading, full, disabled, extClass, disabledType, color } =
    props

  return normalizeClass([
    [
      'du-button',
      'du-button--' + size,
      disabled && disabledType === 'default'
        ? `du-button--${type === 'primary' ? 'secondary' : type}`
        : 'du-button--' + type,
      disabled && disabledType === 'temp' && `du-button--${type}-disabled-temp`,
      disabled &&
        disabledType === 'default' &&
        `du-button--${type === 'primary' ? 'secondary' : type}-disabled-temp`,
      props.theme && `du-theme-${props.theme}`,
    ],
    {
      'du-button--loading': loading,
      'du-button--full': full,
    },
    `du-c-${disabled && disabledType === 'default' ? 'default' : color}-bt`,
    extClass,
  ])
})

const style = computed(() => {
  const { extStyle } = props
  return normalizeStyle(extStyle)
})

const isIconC = computed(() => !!findIcon(props.icon))
const allowClick = computed(() => !props.disabled && !props.loading)

function onClick() {
  if (!props.press && allowClick.value) {
    emit('click')
  }
}

function onStart() {
  if (props.press && allowClick.value) {
    isPress.value = true
    pressStart.value = new Date().getTime()
  }
}

function onEnd() {
  if (props.press) {
    const minPressTime = 150 - (new Date().getTime() - pressStart.value)
    setTimeout(
      () => {
        isPress.value = false
      },
      minPressTime > 0 ? minPressTime : 0,
    )
    if (allowClick.value) {
      emit('click')
    }
  }
}

function onGetUserInfo(...args: any[]) {
  emit('getUserInfo', ...args)
}
</script>
