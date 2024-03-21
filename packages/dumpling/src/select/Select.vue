<template>
  <div>
    <slot :open="handleOpen">
      <div v-if="isInFormItem && formItem">
        <div v-if="mode === 'multiple'" class="du-select__tags">
          <TagsPanel
            :tags="selectedTags"
            @add="handleOpen"
            @remove="handleRemove"
          />
        </div>
        <FormField
          v-else
          :text="selectedText"
          :placeholder="title"
          @click="handleOpen"
        />
      </div>
    </slot>
    <Popup :title="title" v-model:visible="visible" type="bottom">
      <div class="du-select__search" v-if="filterable">
        <Search :placeholder="filterPlaceholder" v-model:value="keyword" />
      </div>
      <scroll-view class="du-select__options" scroll-y>
        <div
          v-for="opt in displayOptions"
          :key="opt.value"
          :class="[
            'du-select__option',
            opt.disabled && 'du-select__option--disabled',
          ]"
          @click="handleSelectOption(opt)"
        >
          <div>{{ opt.label }}</div>
          <Checkbox
            v-if="mode === 'multiple'"
            :checked="isSelected(opt)"
            :disabled="!!opt.disabled"
          />
          <Radio
            v-else
            :checked="isSelected(opt)"
            ext-style="width: fit-content;"
            :disabled="!!opt.disabled"
          />
        </div>
      </scroll-view>
      <div class="du-select__button" v-if="withConfirm">
        <DuButton
          size="large"
          full
          @click="handleConfirm"
          :disabled="isConfirmDisabled"
        >
          {{ confirmText }}
        </DuButton>
      </div>
    </Popup>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import Popup from '../popup/Popup.vue'
import FormField from '../form/FormField.vue'
import Checkbox from '../checkbox/Checkbox.vue'
import { formItemLayoutInjectionKey } from '../form/helpers'
import Radio from '../radio/Radio.vue'
import TagsPanel from '../tags-panel/TagsPanel.vue'
import Search from '../search/Search.vue'
import DuButton from '../button/Button.vue'

export type SelectOption = {
  label: string
  value: string | number
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    /**
     * placeholder（如果在 form item 中）和标题
     */
    title: string
    /**
     * 如果打开 popup
     */
    open?: boolean
    /**
     * 选项列表
     */
    options: SelectOption[]
    /**
     * 选中的值
     */
    value: string | number | string[] | number[]
    /**
     * 不提供为单选，multiple 为多选
     */
    mode?: 'multiple'
    /**
     * 如果为 true，当作为 `DuFormItem` 的子元素时，会自动显示表单项，如果为 false，则不会显示
     */
    formItem: boolean
    /**
     * 可过滤的
     */
    filterable: boolean
    /**
     * 搜索框的 placeholder
     */
    filterPlaceholder: string
    /**
     * 是否带有 confirm button
     */
    withConfirm: boolean
    /**
     * 确认按钮的文字，当 `withConfirm` 为 `true` 时生效
     */
    confirmText: string
  }>(),
  {
    open: undefined,
    title: '请选择',
    value: () => [],
    formItem: true,
    filterable: false,
    filterPlaceholder: '输入关键词搜索...',
    withConfirm: false,
    confirmText: '确认',
  },
)

const emit = defineEmits<{
  (e: 'update:open', open: boolean): void
  (e: 'update:value', value: number | string | string[] | number[]): void
  /**
   * 如果你需要获取选中数据的 label，可以使用这个事件
   */
  (e: 'confirm', value: SelectOption[]): void
}>()

const keyword = ref('')

const formItemLayout = inject(formItemLayoutInjectionKey)

const isInFormItem = !!formItemLayout

const internalOpen = ref(false)

const internalValue = ref<string | number | string[] | number[]>()

const visible = computed({
  get() {
    return props.open ?? internalOpen.value
  },
  set(val) {
    if (props.open == null) {
      internalOpen.value = val
    }
    emit('update:open', val)
  },
})

watch(visible, (v) => {
  if (v && props.withConfirm) {
    internalValue.value = props.value
  }
})

const selectedTags = computed(() => {
  if (Array.isArray(props.value)) {
    return props.options
      .filter((opt) => (props.value as any[]).includes(opt.value))
      .map((opt) => ({
        value: opt.value,
        text: opt.label,
      }))
  } else {
    const opt = props.options.find((opt) => opt.value === props.value)
    return opt
      ? [
          {
            value: opt.value,
            text: opt.label,
          },
        ]
      : []
  }
})

const selectedText = computed(() => {
  if (Array.isArray(props.value)) {
    return props.options
      .filter((opt) => (props.value as any[]).includes(opt.value))
      .map((opt) => opt.label)
      .join(',')
  } else {
    const opt = props.options.find((opt) => opt.value === props.value)
    return opt?.label ?? ''
  }
})

function handleSelectOption(opt: SelectOption) {
  if (opt.disabled) {
    return
  }

  if (props.mode === 'multiple') {
    const value = props.withConfirm
      ? (internalValue.value as any[])
      : (props.value as any[])

    const set = new Set(value)
    if (set.has(opt.value)) {
      set.delete(opt.value)
    } else {
      set.add(opt.value)
    }
    if (props.withConfirm) {
      internalValue.value = Array.from(set)
    } else {
      emit('update:value', Array.from(set))
    }
  } else {
    if (props.withConfirm) {
      internalValue.value = opt.value
    } else {
      emit('update:value', opt.value)
    }
  }
}

function handleOpen() {
  visible.value = true
}

function handleRemove({ value }: { value: number | string }) {
  const set = new Set(props.value as any[])
  set.delete(value)
  emit('update:value', Array.from(set))
}

function isSelected(opt: SelectOption) {
  const val = props.withConfirm ? internalValue.value : props.value
  if (Array.isArray(val)) {
    return (val as any[]).includes(opt.value)
  } else {
    return val === opt.value
  }
}

const displayOptions = computed(() => {
  if (keyword.value) {
    return props.options.filter((opt) =>
      opt.label.includes(keyword.value.trim()),
    )
  }
  return props.options
})

function handleConfirm() {
  if (internalValue.value) {
    emit('update:value', internalValue.value)
    visible.value = false
  }
}

const isConfirmDisabled = computed(() => {
  if (Array.isArray(internalValue.value)) {
    return internalValue.value.length === 0
  }
  return !internalValue.value
})
</script>
