<template>
  <DuRootPortal :disabled="disablePortal" :root="root">
    <div class="du-popup" v-if="innerVisible">
      <div
        :class="maskClassName"
        :style="maskStyleFormat"
        @click="handleMaskClick"
      >
        <slot name="maskContent" />
      </div>
      <div :style="style" :class="className">
        <div
          :class="['du-popup__header', `du-popup__header--${titleAlign}`]"
          v-if="headerVisible"
        >
          <div class="du-popup__title" v-if="title">{{ title }}</div>
          <div v-if="closable" class="du-popup__close" @click="handleClose">
            <DuIcon :unsafe-internal="closeIcon" />
          </div>
        </div>
        <slot />
      </div>
    </div>
  </DuRootPortal>
</template>

<script setup lang="ts">
import {
  computed,
  watch,
  ref,
  inject,
  normalizeStyle,
  normalizeClass,
} from 'vue'
import DuIcon from '../icon/Icon.vue'
import DuRootPortal from '../root-portal/RootPortal.vue'
import { themeInjectionKey } from '../theme/helpers'
import { useBodyScrollLock } from '../composables/useScrollLock'
import { iconClose } from 'dangoui-icon-config'

const props = withDefaults(
  defineProps<{
    /**
     * 标题
     */
    title: string
    /**
     * 标题对齐方式，default 为左对齐
     */
    titleAlign: 'default' | 'center'
    /**
     * 是否展示内置的头部栏
     */
    headerVisible: boolean
    /**
     * 弹出框位置
     */
    type: 'top' | 'bottom' | 'center'
    /**
     * 是否显示
     */
    visible: boolean
    /**
     * extClass
     */
    extClass: string | string[] | Record<string, boolean>
    /**
     * extStyle
     */
    extStyle:
      | string
      | {
          [x: string]: string | number
        }
    /**
     * 点击遮罩层是否关闭
     */
    maskClick: boolean
    /**
     * 是否展示关闭按钮（当内置头部栏展示时有效）
     */
    closable: boolean
    /**
     * maskClass
     */
    maskClass: string | string[] | Record<string, boolean>
    /**
     * maskStyle
     */
    maskStyle:
      | string
      | {
          [x: string]: string | number
        }
    /**
     * 禁止将 Popup 渲染到根节点
     */
    disablePortal: boolean
    /**
     * 是否自带 safe area
     */
    safeArea: boolean

    root: 'app' | 'page'
  }>(),
  {
    title: '',
    titleAlign: 'default',
    headerVisible: true,
    type: 'center',
    visible: false,
    extClass: '',
    extStyle: '',
    maskClick: true,
    closable: true,
    maskClass: '',
    maskStyle: '',
    disablePortal: false,
    safeArea: true,
    root: 'page',
  },
)

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (e: 'close'): void
}>()

const innerVisible = ref(props.visible)
const openAni = ref(false)
const themeConfig = inject(themeInjectionKey, null)

const themeName = computed(() => {
  if (!themeConfig?.name) {
    return 'du-theme-basic g-theme-basic'
  }

  if (typeof themeConfig?.name === 'string') {
    return `du-theme-basic g-theme-basic ${themeConfig.name}`
  }

  return `du-theme-basic g-theme-basic ${themeConfig.name.value}`
})

const style = computed(() => {
  const { extStyle } = props
  return normalizeStyle(extStyle)
})

const className = computed(() => {
  const { extClass } = props

  return normalizeClass([
    'du-popup__content',
    themeName.value,
    extClass,
    {
      [`du-popup--${props.type}`]: true,
      [`du-popup--${props.type}-open`]: openAni.value,
      [`du-popup--${props.type}-safe-area`]: props.safeArea,
    },
  ])
})

const maskStyleFormat = computed(() => {
  const { maskStyle } = props
  return normalizeStyle(maskStyle)
})

const maskClassName = computed(() => {
  const { maskClass } = props
  return normalizeClass([
    'du-popup__mask',
    maskClass,
    {
      'du-popup__mask--open': openAni.value,
    },
  ])
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

if (__WEB__) {
  useBodyScrollLock(() => props.visible)
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

const closeIcon = (function () {
  if (__WEB__) {
    return iconClose
  } else {
    return 'close'
  }
})()
</script>
