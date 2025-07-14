<template>
  <Popup v-model:visible="popupVisible" type="top" :closable="false">
    <div>
      <!-- 选项选择栏 -->
      <div v-if="options.length > 1" class="du-dropdown__options-nav">
        <div
          v-for="(option, index) in options"
          :key="option.value"
          :class="optionNavClassName(index)"
          @click="handleOptionNavChange(index)"
        >
          <div>{{ option.label }}</div>
          <DuIcon name="arrowdown" :size="8" />
        </div>
      </div>
      <DuDivider v-if="options.length > 1" />

      <!-- 选项内容区 -->
      <div class="du-dropdown__content">
        <template v-if="currentOption">
          <div
            v-for="group in currentGroups"
            :key="group.value"
            class="du-dropdown__group"
          >
            <div
              v-if="currentGroups?.length > 1"
              class="du-dropdown__group-title"
            >
              {{ group.label }}
            </div>
            <div class="du-dropdown__tags">
              <div class="du-dropdown__tag-wrapper">
                <DuTag
                  v-for="option in group.options"
                  :key="option.value"
                  class="du-dropdown__tag"
                  :color="isSelected(option, group) ? 'primary' : 'default'"
                  @click="handleSelect(option, group)"
                >
                  {{ option.label }}
                </DuTag>
              </div>
            </div>
          </div>
        </template>
      </div>

      <DuDivider />

      <!-- 底部按钮 -->
      <div class="du-dropdown__footer">
        <div class="du-dropdown__footer-buttons">
          <DuButton
            type="outline"
            color="default"
            size="large"
            :extStyle="{ flex: 1 }"
            @click="handleCancel"
          >
            {{ cancelText }}
          </DuButton>
          <DuButton
            type="primary"
            size="large"
            :extStyle="{ flex: 1 }"
            :disabled="!hasSelected"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </DuButton>
        </div>
      </div>
    </div>
  </Popup>
</template>

<script setup lang="ts">
import { computed, ref, watch, normalizeClass } from 'vue'
import Popup from '../popup/Popup.vue'
import DuButton from '../button/Button.vue'
import DuTag from '../tag/Tag.vue'
import DuDivider from '../divider/Divider.vue'
import DuIcon from '../icon/Icon.vue'

export type DropdownOption = {
  label: string
  value: string
}

export type OptionGroup = {
  label: string
  value: string
  multiple?: boolean
  options: DropdownOption[]
}

export type FilterField = {
  label: string
  value: string
  multiple?: boolean
} & (
  | {
      groups: OptionGroup[]
    }
  | {
      options: DropdownOption[]
    }
)

export type SelectedValue = Record<string, any>

const props = withDefaults(
  defineProps<{
    /**
     * 选项配置
     */
    options: FilterField[]
    /**
     * 当前选中的值
     */
    value: SelectedValue
    /**
     * 是否显示
     */
    visible: boolean
    /**
     * 取消按钮文本
     */
    cancelText?: string
    /**
     * 确认按钮文本
     */
    confirmText?: string
  }>(),
  {
    value: () => ({}),
    flatten: false,
    extClass: '',
    extStyle: '',
    cancelText: '取消',
    confirmText: '确定',
  },
)

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (e: 'update:value', value: SelectedValue): void
  (e: 'confirm', value: SelectedValue): void
}>()

const internalValue = ref<SelectedValue>({})
const currentOptionIndex = ref(0)

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      internalValue.value = JSON.parse(JSON.stringify(props.value))
    } else {
      currentOptionIndex.value = 0
    }
  },
)

const popupVisible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit('update:visible', val)
  },
})

const currentOption = computed(() => props.options[currentOptionIndex.value])

const currentGroups = computed(() => {
  const option = currentOption.value
  if (!option) return []
  if ('options' in option) {
    return [
      {
        label: option.label,
        value: option.value,
        multiple: option.multiple,
        options: option.options,
      },
    ]
  }
  return option.groups
})

function isSelected(option: DropdownOption, group: OptionGroup): boolean {
  const currentOpt = currentOption.value
  if (!currentOpt) return false

  const optionValue = internalValue.value[currentOpt.value]
  if (!optionValue) return false

  if (Array.isArray(optionValue)) {
    return optionValue.some((opt: DropdownOption) => opt.value === option.value)
  }

  const groupOptions = optionValue[group.value]
  if (!groupOptions) return false

  return groupOptions.some((opt: DropdownOption) => opt.value === option.value)
}

function handleSelect(option: DropdownOption, group: OptionGroup) {
  const currentOpt = currentOption.value
  if (!currentOpt) return

  const optionValue = currentOpt.value

  const isMultiple = 'multiple' in group ? group.multiple : currentOpt.multiple

  if ('options' in currentOpt) {
    // 处理直接有options的情况
    let currentOptions: DropdownOption[]

    if (
      !internalValue.value[optionValue] ||
      !Array.isArray(internalValue.value[optionValue])
    ) {
      currentOptions = []
      internalValue.value = {
        ...internalValue.value,
        [optionValue]: currentOptions,
      }
    } else {
      currentOptions = internalValue.value[optionValue]
    }

    const existingIndex = currentOptions.findIndex(
      (opt) => opt.value === option.value,
    )

    if (isMultiple) {
      if (existingIndex > -1) {
        currentOptions.splice(existingIndex, 1)
      } else {
        currentOptions.push(option)
      }
    } else {
      internalValue.value[optionValue] = [option]
    }
  } else {
    // 处理有groups的情况
    let optionsValue: Record<string, DropdownOption[]>

    if (
      !internalValue.value[optionValue] ||
      Array.isArray(internalValue.value[optionValue])
    ) {
      optionsValue = {}
      internalValue.value = {
        ...internalValue.value,
        [optionValue]: optionsValue,
      }
    } else {
      optionsValue = internalValue.value[optionValue]
    }

    if (!optionsValue[group.value]) {
      optionsValue[group.value] = []
    }

    const groupOptions = optionsValue[group.value]
    const existingIndex = groupOptions.findIndex(
      (opt) => opt.value === option.value,
    )

    if (isMultiple) {
      if (existingIndex > -1) {
        groupOptions.splice(existingIndex, 1)
      } else {
        groupOptions.push(option)
      }
    } else {
      optionsValue[group.value] = [option]
    }
  }
  internalValue.value = { ...internalValue.value }
}

function handleOptionNavChange(index: number) {
  currentOptionIndex.value = index
}

function handleCancel() {
  internalValue.value = JSON.parse(JSON.stringify(props.value))
  popupVisible.value = false
}

function handleConfirm() {
  const selectedOptions: SelectedValue = {}

  props.options.forEach((option) => {
    const optionValue = option.value
    const filterValue = internalValue.value[optionValue] || {}

    // 处理直接有options的情况
    if ('options' in option) {
      const options = filterValue as DropdownOption[]
      selectedOptions[optionValue] = options || []
    } else {
      // 处理有groups的情况
      const groupedValue = filterValue as Record<string, DropdownOption[]>
      selectedOptions[optionValue] = groupedValue
    }
  })
  popupVisible.value = false
  emit('update:value', selectedOptions)
  emit('confirm', selectedOptions)
}

const hasSelected = computed(() => {
  const optionValues = internalValue.value || {}
  return Object.values(optionValues).some((optionValue) => {
    if (Array.isArray(optionValue)) {
      return optionValue.length > 0
    }
    return Object.values(optionValue).some(
      (groupValue) => Array.isArray(groupValue) && groupValue.length > 0,
    )
  })
})

function optionNavClassName(index: number) {
  return normalizeClass([
    'du-dropdown__option-nav',
    {
      'du-dropdown__option-nav--active': currentOptionIndex.value === index,
    },
  ])
}
</script>
