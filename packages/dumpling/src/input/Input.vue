<template>
  <div class="du-input" :style="style" :class="className">
    <div
      :class="[
        'du-input__inner',
        isInFormItem && 'du-input__inner--next',
        bordered && 'du-input__inner--bordered',
      ]"
    >
      <div v-if="props.prefix" class="du-input__prefix">
        {{ props.prefix }}
      </div>
      <input
        :class="[
          'du-input__input',
          {
            'du-input__input--align-right': props.inputAlign === 'right',
            'du-input__input--align-center': props.inputAlign === 'center',
            'du-input__input--disabled': props.disabled,
            'du-input__input--without-border': props.withoutBorder,
          },
        ]"
        placeholder-class="du-input__input--placeholder"
        :type="props.type"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :maxlength="props.maxlength"
        :focus="focus"
        :password="props.password"
        :cursor-spacing="props.cursorSpacing"
        :confirm-type="props.confirmType"
        :always-embed="props.alwaysEmbed"
        :confirm-hold="props.confirmHold"
        :selection-start="props.selectionStart"
        :selection-end="props.selectionEnd"
        :adjust-position="props.adjustPosition"
        :value="mValue"
        :autofocus="props.autofocus"
        @input="onInnerInput"
        @focus="onFocus"
        @blur="onBlur"
        @confirm="onConfirm"
        @keyboardheightchange="onKeyboardHeightChange"
      />
      <div v-if="props.suffix" class="du-input__suffix">
        {{ props.suffix }}
      </div>
      <DuIcon
        v-if="rightIcon"
        :name="rightIcon"
        :size="rightIconSize"
        color="#918b9f"
      />
    </div>
    <div
      v-if="!isInFormItem && !props.bordered"
      class="du-input__bottom-line"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue'

import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'
import DuIcon from '../icon/Icon.vue'
import { listenFormItemClickInjectionKey } from '../form/helpers'

const props = withDefaults(
  defineProps<{
    extClass: string | string[] | Record<string, boolean>
    extStyle: string | Record<string, string>
    type:
      | 'text'
      | 'number'
      | 'idcard'
      | 'digit'
      | 'safe-password'
      | 'nickname'
      | 'password'
    placeholder: string
    value: string
    maxlength: number
    inputAlign: string
    /**
     * 禁用
     */
    disabled: boolean
    /**
     * 是否展示外边框
     */
    bordered: boolean
    /**
     * 是否展示底部的分割线，可能想改一下这个名字
     */
    withoutBorder: boolean
    /**
     * 前缀文本
     */
    prefix: string
    /**
     * 自动去除输入的空格
     */
    trim: boolean
    /**
     * 后缀文本
     */
    suffix: string
    /**
     * 自动聚焦，拉起键盘
     */
    autofocus: boolean
    /**
     * 是否是密码类型
     * @available wx
     */
    password: boolean
    /**
     * cursorSpacing
     * @available wx
     */
    cursorSpacing: number
    /**
     * confirmType
     * @available wx
     */
    confirmType: string
    /**
     * alwaysEmbed
     * @available wx
     */
    alwaysEmbed: boolean
    /**
     * confirmHold
     * @available wx
     */
    confirmHold: boolean
    /**
     * cursor
     * @available wx
     */
    cursor: number
    /**
     * selectionStart
     * @available wx
     */
    selectionStart: number
    /**
     * selectionEnd
     * @available wx
     */
    selectionEnd: number
    /**
     * adjustPosition
     * @available wx
     */
    adjustPosition: boolean
    /**
     * rightIcon
     */
    rightIcon?: string
    /**
     * rightIconSize
     */
    rightIconSize?: string
  }>(),
  {
    extClass: '',
    extStyle: '',
    type: 'text',
    placeholder: '',
    value: '',
    maxlength: -1,
    inputAlign: 'left',
    disabled: false,
    bordered: false,
    withoutBorder: false,
    prefix: '',
    trim: false,
    suffix: '',
    autofocus: false,
    password: false,
    cursorSpacing: 0,
    confirmType: 'done',
    alwaysEmbed: false,
    confirmHold: false,
    cursor: 0,
    selectionStart: -1,
    selectionEnd: -1,
    adjustPosition: true,
  },
)

const emit = defineEmits<{
  (e: 'input', value: string): void
  (e: 'change', value: string): void
  (e: 'focus', value: { detail: { height: number } }): void
  (e: 'blur', value: { detail: {} }): void
  (e: 'confirm', value: { detail: { value: string } }): void
  (
    e: 'keyboardheightchange',
    value: { detail: { height: number; duration: number } },
  ): void
  (e: 'update:value', value: string): void
}>()

const mValue = ref('')
const focus = ref(false)

const listenFormItemOnClick = inject(listenFormItemClickInjectionKey)

const isInFormItem = !!listenFormItemOnClick

const className = computed(() => {
  const { extClass } = props
  return classNames(
    'du-input',
    {
      'du-input--next': isInFormItem,
      'du-input--bordered': props.bordered,
      'du-input--bordered-disabled': props.disabled && props.bordered,
    },
    extClass,
  )
})

const style = computed(() => {
  const { extStyle } = props
  return typeof extStyle === 'string'
    ? extStyle
    : styleToCss({
        ...extStyle,
      })
})

watch(
  () => listenFormItemOnClick,
  (listenOnClick) => {
    if (listenOnClick) {
      listenOnClick(() => switchFocus(true))
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => props.value,
  (val) => {
    mValue.value = val
  },
  {
    immediate: true,
  },
)

watch(mValue, (val) => {
  if (val !== props.value) {
    emit('input', val)
    emit('update:value', val)
    emit('change', val)
  }
})

function switchFocus(status: boolean) {
  // todo: 仅支持小程序控制,需要进一步实现web端
  if (focus.value !== status) {
    focus.value = status
  }
}

function onFocus(e: any) {
  switchFocus(true)
  emit('focus', e)
}

function onBlur(e: any) {
  switchFocus(false)
  emit('blur', e)
}

function onConfirm(e: any) {
  emit('confirm', e)
}

function onKeyboardHeightChange(e: any) {
  emit('keyboardheightchange', e)
}

function onInnerInput(e: any) {
  let val = e.target.value
  if (props.trim) {
    val = val.trim()
  }

  mValue.value = val
}
</script>
