<template>
  <div v-if="custom" :class="className" :style="style" @click="onClick">
    <slot />
  </div>
  <div v-else :class="className" :style="style" @click="onClick">
    <div class="du-checkbox__label">
      <slot>{{ label }}</slot>
    </div>
    <CheckboxIcon
      :selected="selected"
      :shape="config?.shape"
      :size="config.size"
      :border="config.border"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, inject, watch } from 'vue'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'
import CheckboxIcon from './CheckboxIcon.vue'
import {
  groupConfigInjectionKey,
  groupValueInjectionKey,
  setGroupValueInjectionKey,
} from './helpers'

const props = withDefaults(
  defineProps<{
    extClass: string | string[] | Record<string, boolean>
    extStyle: string | Record<string, string>
    shape: string
    inline: boolean
    disabled: boolean
    label: string
    checked?: boolean
    value?: string
    custom: boolean
    position: string
    size: string
    border: string
  }>(),
  {
    extClass: '',
    extStyle: '',
    shape: 'round',
    inline: false,
    disabled: false,
    custom: false,
    position: 'right',
    size: '20px',
    border: '',
  },
)

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'update:checked', value: boolean): void
}>()

const state = reactive({
  currentVal: false,
})

const groupConfig = inject(groupConfigInjectionKey)
const groupValue = inject(groupValueInjectionKey)
const setGroupValue = inject(setGroupValueInjectionKey)

watch(
  () => props.checked,
  (val) => {
    if (!groupValue) {
      state.currentVal = val
    }
  },
  {
    immediate: true,
  },
)

if (groupValue) {
  watch(
    groupValue,
    () => {
      const { value } = props
      if (!groupValue?.value) return

      state.currentVal = !!groupValue.value.find((v) => v === value)
    },
    { immediate: true },
  )
}

const config = computed(() => {
  const {
    extClass,
    extStyle,
    shape,
    inline,
    disabled,
    label,
    value,
    custom,
    position,
    size,
    border,
    checked,
  } = props

  return {
    extClass,
    extStyle,
    disabled,
    label,
    value,
    custom,
    shape: groupConfig?.value.shape ?? shape,
    inline: groupConfig?.value.inline ?? inline,
    position: groupConfig?.value.position ?? position,
    size,
    border,
    checked,
  }
})

const className = computed(() => {
  const { extClass, inline, disabled, position } = config.value
  return classNames(
    ['du-checkbox', 'du-checkbox--' + position],
    {
      'du-checkbox--disabled': disabled,
      'du-checkbox--inline': inline,
    },
    extClass,
  )
})

const style = computed(() => {
  const { extStyle } = config.value
  return typeof extStyle === 'string' ? extStyle : styleToCss({ ...extStyle })
})

const selected = computed(() => {
  return !!state.currentVal
})

function onClick() {
  if (props.disabled) return

  const { value } = config.value

  if (groupValue?.value && setGroupValue && value) {
    if (!groupValue.value.find((g) => g === value)) {
      setGroupValue([...groupValue.value, value])
    } else {
      setGroupValue(groupValue.value.filter((item) => item !== value))
    }
  } else {
    emit('update:checked', !state.currentVal)
  }
}
</script>
