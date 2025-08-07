<template>
  <div v-if="custom" :class="className" :style="style" @click="onClick">
    <slot />
  </div>
  <div v-else-if="config.shape === 'card'" :class="className" @click="onClick">
    <div class="du-checkbox__card-inner">
      <slot>
        <div class="du-checkbox__card-label">
          {{ label }}
        </div>
      </slot>
    </div>
    <div
      :class="[
        'du-checkbox__card-icon',
        `du-checkbox__card-icon--${config.position}`,
      ]"
    >
      <CheckboxIcon
        :color="config.color"
        :selected="selected"
        :shape="config.shape"
        :size="config.size"
        :border="config.border"
      />
    </div>
  </div>
  <div v-else :class="className" :style="style" @click="onClick">
    <div class="du-checkbox__label">
      <slot>{{ label }}</slot>
    </div>
    <CheckboxIcon
      :color="config.color"
      :selected="selected"
      :shape="config.shape"
      :size="config.size"
      :border="config.border"
    />
  </div>
</template>

<script setup lang="ts">
import {
  reactive,
  computed,
  inject,
  watch,
  normalizeStyle,
  normalizeClass,
} from 'vue'
import CheckboxIcon from './CheckboxIcon.vue'
import {
  groupConfigInjectionKey,
  groupValueInjectionKey,
  setGroupValueInjectionKey,
} from './helpers'

const props = withDefaults(
  defineProps<{
    extClass: string | string[] | Record<string, boolean>
    extStyle:
      | string
      | {
          [x: string]: string | number
        }
    /**
     * 形状
     *
     * @default "round"
     */
    shape?: 'round' | 'square' | 'card'
    /**
     * 行内元素
     *
     * @default false
     */
    inline?: boolean
    /**
     * 是否禁用
     */
    disabled: boolean
    /**
     * label，如果使用 `default slot`，可以不传
     */
    label?: string
    /**
     * 是否选中，独立使用 `Checkbox` 时使用
     */
    checked?: boolean
    /**
     * 值，配合 `CheckboxGroup` 使用
     */
    value?: string
    /**
     * 自定义展示
     */
    custom?: boolean
    /**
     * 对勾图标位置
     *
     * @default "right"
     */
    position?: 'left' | 'right'
    /**
     * 对勾图标大小
     */
    size: string
    /**
     * 对勾边框
     */
    border: string
    /**
     * 色彩，可以使用色板中的颜色名
     */
    color: string
  }>(),
  {
    extClass: '',
    extStyle: '',
    disabled: false,
    custom: false,
    size: '20px',
    border: '',
    color: undefined,
  },
)

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'update:checked', value: boolean): void
}>()

const state = reactive({
  currentVal: false,
})

const groupConfig = inject(groupConfigInjectionKey, null)
const groupValue = inject(groupValueInjectionKey, null)
const setGroupValue = inject(setGroupValueInjectionKey, () => null)

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
    color,
  } = props

  return {
    extClass,
    extStyle,
    disabled,
    label,
    value,
    custom: custom || groupConfig?.value.custom || false,
    shape: shape || groupConfig?.value.shape || 'round',
    inline: inline || groupConfig?.value.inline || false,
    position: position || groupConfig?.value.position || 'right',
    color: color || groupConfig?.value.color || 'primary',
    size,
    border,
    checked,
  }
})

const selected = computed(() => {
  return !!state.currentVal
})

const className = computed(() => {
  const { extClass, inline, disabled, position, shape } = config.value

  if (shape === 'card') {
    return normalizeClass([
      ['du-checkbox__card'],
      {
        'du-checkbox--inline': inline,
        'du-checkbox__card--selected': selected.value,
      },
      extClass,
    ])
  }

  return normalizeClass([
    ['du-checkbox', 'du-checkbox--' + position],
    {
      'du-checkbox--disabled': disabled,
      'du-checkbox--inline': inline,
    },
    extClass,
  ])
})

const style = computed(() => {
  const { extStyle } = config.value
  return normalizeStyle(extStyle)
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
