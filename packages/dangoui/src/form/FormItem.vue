<template>
  <div :class="className" :style="style" @click="onClick">
    <div class="du-form-item__content">
      <div
        :class="[
          'du-form-item__label',
          {
            'du-form-item__label--right': config?.labelAlign === 'right',
          },
        ]"
        :style="{
          width: config.layout === 'vertical' ? '100%' : config?.labelSize,
        }"
      >
        <span>{{ config?.label }}</span>
        <span v-if="config?.required" class="du-form-item__label__required">
          {{ '*' }}
        </span>
        <div
          v-if="config?.info"
          @click.stop="handleInfoTap"
          class="du-form-item__label__info"
        >
          <DuIcon :unsafe-internal="questionCircleIcon" />
        </div>
        <span class="du-form-item__label__dirty" v-if="config?.isDirty">
          {{ t('edited') }}
        </span>
      </div>
      <div v-if="config.layout === 'horizontal'" class="du-form-item__slot">
        <div class="du-form-item__slot-inner-wrapper">
          <div class="du-form-item__slot-inner">
            <slot />
          </div>
          <div v-if="showBorder" class="du-form-item__bottom-line" />
        </div>
        <slot name="tips">
          <div
            v-if="config?.tips"
            class="du-form-item__tips"
            selectable
            user-select
          >
            {{ config?.tips }}
          </div>
        </slot>
      </div>
    </div>
    <div v-if="config.layout === 'vertical'" class="du-form-item__slot">
      <div
        class="du-form-item__slot-inner-wrapper du-form-item__slot-inner-wrapper--vertical"
      >
        <div class="du-form-item__slot-inner">
          <slot />
        </div>
        <div v-if="showBorder" class="du-form-item__bottom-line" />
      </div>
      <div>
        <slot name="tips">
          <text
            v-if="config?.tips"
            class="du-form-item__tips"
            selectable
            user-select
          >
            {{ config?.tips }}
          </text>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  provide,
  inject,
  onBeforeUnmount,
  normalizeStyle,
  normalizeClass,
} from 'vue'
import DuIcon from '../icon/Icon.vue'
import {
  formItemLayoutInjectionKey,
  formLabelAlignInjectionKey,
  formLabelSizeInjectionKey,
  listenFormItemClickInjectionKey,
} from './helpers'
import { iconQuestionCircle } from 'dangoui-icon-config'
import { useLocale } from '../locale'

const { useTranslator } = useLocale()
const t = useTranslator('FormItem')


const props = withDefaults(
  defineProps<{
    extClass: string | string[] | Record<string, boolean>
    extStyle:
      | string
      | {
          [x: string]: string | number
        }
    label: string
    labelAlign: 'left' | 'right'
    labelSize: string
    layout?: 'vertical' | 'horizontal'
    tips: string
    required: boolean
    info: string
    isDirty: boolean
    showBorder: boolean
    /**
     * 内容区域水平位置的对齐方式
     */
    justify?: 'start' | 'end'
    /**
     * 内容区域的对齐方式，仅在 horizontal 模式下生效
     */
    items?: 'start' | 'center'
    options: {
      label: string
      labelAlign: 'left' | 'right'
      labelSize: string
      tips: string
      required: boolean
      info: string
      isDirty: boolean
      extClass: string | string[] | Record<string, boolean>
      extStyle:
        | string
        | {
            [x: string]: string | number
          }
    }
  }>(),
  {
    extClass: '',
    extStyle: '',
    label: '',
    labelAlign: 'left',
    labelSize: '',
    tips: '',
    required: false,
    info: '',
    isDirty: false,
    showBorder: true,
    options: undefined,
  },
)

const emit = defineEmits<{
  (e: 'showInfo', info: string | boolean): void
}>()

const formLabelSize = inject(formLabelSizeInjectionKey, '60px')
const formLabelAlign = inject(formLabelAlignInjectionKey, 'left')
const formItemLayout = inject(formItemLayoutInjectionKey, 'horizontal')

const onClickListeners = ref<(() => void)[]>([])

const config = computed(() => {
  const {
    label,
    labelSize,
    labelAlign,
    tips,
    required,
    info,
    extStyle,
    extClass,
    isDirty,
  } = {
    ...props,
    ...props.options,
  }

  return {
    label,
    tips,
    required,
    labelSize: labelSize || formLabelSize,
    labelAlign: labelAlign || formLabelAlign,
    layout: props.layout || formItemLayout || 'horizontal',
    info,
    extStyle,
    extClass,
    isDirty,
  }
})

const style = computed(() => {
  const { extStyle } = config.value
  return normalizeStyle(extStyle)
})

const className = computed(() => {
  const { extClass, layout } = config.value
  return normalizeClass([
    'du-form-item',
    {
      'du-form-item--slot-next-line': layout === 'vertical',
    },
    extClass,
  ])
})

onBeforeUnmount(() => {
  onClickListeners.value = []
})

function onClick() {
  onClickListeners.value.forEach((fn) => {
    typeof fn === 'function' && fn()
  })
}

function listenOnClick(listener: () => void) {
  onClickListeners.value.push(listener)
}

function handleInfoTap() {
  emit('showInfo', config.value.info)
}

provide(listenFormItemClickInjectionKey, listenOnClick)

const questionCircleIcon = (function () {
  if (__WEB__) {
    return iconQuestionCircle
  } else {
    return 'question-circle'
  }
})()
</script>
