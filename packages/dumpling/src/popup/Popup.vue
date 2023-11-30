<template>
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
        <div class="du-popup__title">{{ title }}</div>
        <div v-if="closable" class="du-popup__close" @click="handleClose" />
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import classNames from 'classnames'
import styleToCss from 'style-object-to-css-string'

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
    extStyle: string | Record<string, string>
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
    maskStyle: string | Record<string, string>
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
  },
)

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (e: 'close'): void
}>()

const innerVisible = ref(props.visible)
const openAni = ref(false)

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

  return classNames('du-popup__content', extClass, {
    [`du-popup--${props.type}`]: true,
    [`du-popup--${props.type}-open`]: openAni.value,
  })
})

const maskStyleFormat = computed(() => {
  const { maskStyle } = props
  return typeof maskStyle === 'string'
    ? maskStyle
    : styleToCss({
        ...maskStyle,
      })
})

const maskClassName = computed(() => {
  const { maskClass } = props
  return classNames('du-popup__mask', maskClass, {
    'du-popup__mask--open': openAni.value,
  })
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
</script>
