<template>
  <!-- add minus 使用click.stop的原因是避免与FormItem组件一起使用时，点击事件冒泡导致DuInput触发聚焦频繁唤起键盘 -->
  <div :class="[`du-input-number`, `du-c-${color}-input-number`]">
    <div
      :class="minusItemClass"
      @click.stop="minus"
      :style="{
        visibility: isEmpty && compact ? 'hidden' : 'visible',
      }"
    >
      <DuIcon name="reduce-heavy" />
    </div>
    <div
      v-if="input && !disabled"
      :class="['du-input-number__input', `du-input-number__input--${size}`]"
      :style="{
        visibility: isEmpty && compact ? 'hidden' : 'visible',
      }"
    >
      <input
        class="du-input-number__input-el"
        :value="inputValue"
        @input="onInput"
      />
    </div>

    <div
      v-else
      :class="[
        'du-input-number__value',
        `du-input-number__value--${size}`,
        disabled && 'du-input-number__value--disabled',
      ]"
      :style="{
        visibility: isEmpty && compact ? 'hidden' : 'visible',
      }"
    >
      {{ inputValue }}
    </div>

    <div :class="addItemClass" @click.stop="add">
      <DuIcon name="plus-heavy" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DuIcon from '../icon/Icon.vue'

const props = withDefaults(
  defineProps<{
    /**
     * 色板颜色
     */
    color: string
    /**
     * 值（数字）
     */
    value: number
    /**
     * 允许的最小值
     */
    min: number
    /**
     * 允许的最大值
     */
    max: number
    /**
     * 是否允许用户直接输入
     */
    input: boolean
    /**
     * 步长
     */
    step: number
    /**
     * 大小
     */
    size: 'mini' | 'small' | 'normal' | 'medium' | 'large'
    /**
     * 强调增加按钮
     */
    highlightAdd: boolean
    /**
     * 强调较少按钮
     */
    highlightMinus: boolean
    /**
     * 禁用
     */
    disabled: boolean
    /**
     * 允许小数
     */
    allowDecimal: boolean
    /**
     * 紧凑（0 的时候仅显示增加按钮）
     */
    compact: boolean
  }>(),
  {
    color: 'primary',
    value: 0,
    min: 0,
    max: Infinity,
    input: false,
    step: 1,
    size: 'mini',
  },
)

const emit = defineEmits<{
  (e: 'change', val: number): void
  (e: 'input', val: number): void
  (e: 'update:value', val: number): void
}>()

function isEqual(left: string | number, right: string | number) {
  return +left === +right
}

const inputValue = ref(`${props.value}`)

watch(
  () => props.value,
  (val) => {
    if (!isEqual(inputValue.value, val)) {
      inputValue.value = `${val}`
    }
  },
)

watch(inputValue, (val) => {
  emit('input', +val)
  emit('update:value', +val)
  emit('change', +val)
})

function minus() {
  if (props.disabled) {
    return
  }
  const { step, min } = props
  const nVal = +inputValue.value - step
  if (nVal >= min) {
    inputValue.value = `${nVal}`
  }
}

function add() {
  if (props.disabled) {
    return
  }
  const { step, max } = props
  const nVal = +inputValue.value + step
  if (nVal <= max) {
    inputValue.value = `${nVal}`
  }
}

const isMinusDisabled = computed(() => {
  const { min } = props
  return +inputValue.value <= min
})

const isAddDisabled = computed(() => {
  const { max } = props
  return +inputValue.value >= max
})

function onInput(e: any) {
  const previousValue = inputValue.value

  let val = e.target.value

  if (props.allowDecimal) {
    if (val !== '' && !/^\d+(\.\d*)?$/.test(val)) {
      if (__WEB__) {
        e.target.value = previousValue
      }
      return previousValue
    }
  } else {
    if (val !== '' && !/^\d+$/.test(val)) {
      if (__WEB__) {
        e.target.value = previousValue
      }
      return previousValue
    }
  }

  if (+val > props.max) {
    if (__WEB__) {
      e.target.value = `${props.max}`
    }
    inputValue.value = `${props.max}`
  } else if (+val < props.min) {
    if (__WEB__) {
      e.target.value = `${props.min}`
    }
    inputValue.value = `${props.min}`
  } else {
    inputValue.value = val
  }

  return inputValue.value
}

const minusItemClass = computed(() => {
  const classes = [
    'du-input-number__item',
    `du-input-number__item--${props.size}`,
  ]
  if (props.disabled) {
    classes.push('du-input-number__item--disabled')
  } else if (isMinusDisabled.value) {
    if (props.highlightMinus) {
      classes.push('du-input-number__item--highlight-disabled')
    } else {
      classes.push('du-input-number__item--disabled')
    }
  } else if (props.highlightMinus) {
    classes.push('du-input-number__item--highlight')
  }
  if (props.disabled || props.input) {
    classes.push('du-input-number__item--left-with-input')
  }
  return classes
})

const addItemClass = computed(() => {
  const classes = [
    'du-input-number__item',
    `du-input-number__item--${props.size}`,
  ]
  if (props.disabled) {
    classes.push('du-input-number__item--disabled')
  } else if (isAddDisabled.value) {
    if (props.highlightAdd) {
      classes.push('du-input-number__item--highlight-disabled')
    } else {
      classes.push('du-input-number__item--disabled')
    }
  } else if (props.highlightAdd) {
    classes.push('du-input-number__item--highlight')
  }

  if (props.disabled || props.input) {
    classes.push('du-input-number__item--right-with-input')
  }
  return classes
})

const isEmpty = computed(() => {
  return !+inputValue.value
})
</script>
