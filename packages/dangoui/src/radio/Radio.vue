<template>
  <div
    v-if="config.custom"
    :class="className"
    :style="style"
    @click="handleClick"
  >
    <slot />
  </div>
  <div v-else :class="className" :style="style" @click="handleClick">
    <template v-if="config.shape === 'normal'">
      <template v-if="config.cell">
        <div class="du-radio__label">
          <slot>
            {{ config.label }}
          </slot>
        </div>
        <RadioIcon
          :color="config.color"
          :checked="innerChecked"
          :disabled="disabled"
        />
      </template>
      <template v-else>
        <RadioIcon
          :color="config.color"
          :checked="innerChecked"
          :disabled="disabled"
        />
        <div class="du-radio__label">
          <slot>
            {{ config.label }}
          </slot>
        </div>
      </template>
    </template>

    <DuButton
      v-else-if="config.shape === 'button'"
      size="mini"
      :color="innerChecked ? config.color : 'default'"
      :type="innerChecked ? 'primary' : 'outline'"
    >
      <slot>
        {{ config.label }}
      </slot>
    </DuButton>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, normalizeStyle, normalizeClass } from 'vue'
import DuButton from '../button/Button.vue'
import RadioIcon from './RadioIcon.vue'
import {
  groupConfigInjectionKey,
  groupValueInjectionKey,
  setGroupValueInjectionKey,
} from './helpers'

const props = withDefaults(
  defineProps<{
    extClass?: string | string[] | Record<string, boolean>
    extStyle?:
      | string
      | {
          [x: string]: string | number
        }
    label?: string
    /**
     * 形状
     *
     * @default "normal"
     */
    shape?: string
    custom?: boolean
    inline?: boolean
    disabled?: boolean
    cell?: boolean
    value?: any
    valueKey?: string
    checked?: boolean
    /**
     * 色彩，可以使用色板中的颜色名
     *
     */
    color?: string
  }>(),
  {
    extClass: '',
    extStyle: '',
    custom: false,
    inline: false,
    disabled: false,
    cell: false,
    color: undefined,
  },
)

const emit = defineEmits<{
  (e: 'click', event: any): void
  (e: 'input', value: { checked: boolean; value: any | undefined }): void
  (e: 'update:value', value: { checked: boolean; value: any | undefined }): void
  (e: 'update:checked', value: boolean): void
}>()

const groupConfig = inject(groupConfigInjectionKey, null)
const groupValue = inject(groupValueInjectionKey, null)
const groupUpdateValue = inject(setGroupValueInjectionKey, null)

const config = computed(() => {
  const {
    extStyle,
    extClass,
    label,
    inline,
    custom,
    disabled,
    shape,
    cell,
    value,
    valueKey,
    color,
  } = {
    ...props,
  }

  return {
    extStyle,
    extClass,
    label,
    inline: inline || groupConfig?.value.inline || false,
    custom: custom || groupConfig?.value.custom || false,
    disabled,
    shape: shape || groupConfig?.value.shape || 'normal',
    cell: cell || groupConfig?.value.cell || false,
    value,
    valueKey: valueKey || groupConfig?.value.valueKey || '',
    color: color || groupConfig?.value.color || 'primary',
  }
})

const className = computed(() => {
  const { inline, disabled, extClass, cell } = config.value
  return normalizeClass([
    'du-radio',
    {
      'du-radio--inline': inline,
      'du-radio--disabled': disabled,
      'du-radio--cell': cell,
    },
    extClass,
  ])
})

const style = computed(() => {
  const { extStyle } = config.value
  return normalizeStyle(extStyle)
})

const innerChecked = computed(() => {
  if (!groupValue) {
    return props.checked
  }

  const { value, valueKey } = config.value

  if (valueKey) {
    return value?.[valueKey] === groupValue?.value?.[valueKey]
  }

  return value === groupValue?.value
})

function update(value: string | number) {
  if (groupUpdateValue) {
    groupUpdateValue(value)
  }
  emit('input', { checked: true, value })
  emit('update:value', { checked: true, value })
  emit('update:checked', true)
}

function handleClick(event: any) {
  emit('click', event)

  if (config.value.disabled) {
    return
  }

  if (!groupValue) {
    if (!props.checked) {
      emit('input', { checked: true, value: config.value.value })
      emit('update:value', { checked: true, value: config.value.value })
      emit('update:checked', true)
    }
  } else {
    const { value } = config.value

    if (value) {
      update(value)
    }
  }
}
</script>
