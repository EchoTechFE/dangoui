<template>
  <Popup v-model:visible="popupVisible" type="top" :closable="false">
    <div>
      <!-- 筛选维度选择栏 -->
      <div v-if="dimensions.length > 1" class="du-dropdown__dimensions">
        <div
          v-for="(dimension, index) in dimensions"
          :key="dimension.value"
          :class="dimensionClassName(index)"
          @click="handleDimensionChange(index)"
        >
          {{ dimension.label }}
          <DuIcon name="arrowdown" :size="8" />
        </div>
      </div>
      <DuDivider v-if="dimensions.length > 1" />

      <!-- 选项内容区 -->
      <div class="du-dropdown__content">
        <template v-if="currentDimension">
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

export type FilterDimension = {
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
     * 筛选维度配置
     */
    dimensions: FilterDimension[]
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
const currentDimensionIndex = ref(0)
const isConfirming = ref(false)

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      internalValue.value = JSON.parse(JSON.stringify(props.value))
    } else {
      currentDimensionIndex.value = 0
      isConfirming.value = false
    }
  },
)

const popupVisible = computed({
  get() {
    return props.visible
  },
  set(val) {
    if (!val && !isConfirming.value) {
      internalValue.value = JSON.parse(JSON.stringify(props.value))
    }
    emit('update:visible', val)
  },
})

const currentDimension = computed(
  () => props.dimensions[currentDimensionIndex.value],
)

const currentGroups = computed(() => {
  const dimension = currentDimension.value
  if (!dimension) return []
  if ('options' in dimension) {
    return [
      {
        label: dimension.label,
        value: dimension.value,
        multiple: dimension.multiple,
        options: dimension.options,
      },
    ]
  }
  return dimension.groups
})

function isSelected(option: DropdownOption, group: OptionGroup): boolean {
  const dimension = currentDimension.value
  if (!dimension) return false

  const dimensionValue = internalValue.value[dimension.value]
  if (!dimensionValue) return false

  if (Array.isArray(dimensionValue)) {
    return dimensionValue.some(
      (opt: DropdownOption) => opt.value === option.value,
    )
  }

  const groupOptions = dimensionValue[group.value]
  if (!groupOptions) return false

  return groupOptions.some((opt: DropdownOption) => opt.value === option.value)
}

function handleSelect(option: DropdownOption, group: OptionGroup) {
  const dimension = currentDimension.value
  if (!dimension) return

  const dimensionValue = dimension.value

  const isMultiple = 'multiple' in group ? group.multiple : dimension.multiple

  if ('options' in dimension) {
    // 处理直接有options的情况
    let currentOptions: DropdownOption[]

    if (
      !internalValue.value[dimensionValue] ||
      !Array.isArray(internalValue.value[dimensionValue])
    ) {
      currentOptions = []
      internalValue.value = {
        ...internalValue.value,
        [dimensionValue]: currentOptions,
      }
    } else {
      currentOptions = internalValue.value[dimensionValue]
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
      internalValue.value[dimensionValue] = [option]
    }
  } else {
    // 处理有groups的情况
    let dimValue: Record<string, DropdownOption[]>

    if (
      !internalValue.value[dimensionValue] ||
      Array.isArray(internalValue.value[dimensionValue])
    ) {
      dimValue = {}
      internalValue.value = {
        ...internalValue.value,
        [dimensionValue]: dimValue,
      }
    } else {
      dimValue = internalValue.value[dimensionValue]
    }

    if (!dimValue[group.value]) {
      dimValue[group.value] = []
    }

    const groupOptions = dimValue[group.value]
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
      dimValue[group.value] = [option]
    }
  }
  internalValue.value = { ...internalValue.value }
}

function handleDimensionChange(index: number) {
  currentDimensionIndex.value = index
}

function handleCancel() {
  internalValue.value = JSON.parse(JSON.stringify(props.value))
  popupVisible.value = false
}

function handleConfirm() {
  isConfirming.value = true
  const selectedOptions: SelectedValue = {}

  props.dimensions.forEach((dimension) => {
    const dimensionValue = dimension.value
    const dimValue = internalValue.value[dimensionValue] || {}

    // 处理直接有options的情况
    if ('options' in dimension) {
      const options = dimValue as DropdownOption[]
      selectedOptions[dimensionValue] = options || []
    } else {
      // 处理有groups的情况
      const groupedValue = dimValue as Record<string, DropdownOption[]>
      selectedOptions[dimensionValue] = groupedValue
    }
  })
  popupVisible.value = false
  emit('update:value', selectedOptions)
  emit('confirm', selectedOptions)
}

const hasSelected = computed(() => {
  const dimensionValues = internalValue.value || {}
  return Object.values(dimensionValues).some((dimensionValue) => {
    if (Array.isArray(dimensionValue)) {
      return dimensionValue.length > 0
    }
    return Object.values(dimensionValue).some(
      (groupValue) => Array.isArray(groupValue) && groupValue.length > 0,
    )
  })
})

function dimensionClassName(index: number) {
  return normalizeClass([
    'du-dropdown__dimension',
    {
      'du-dropdown__dimension--active': currentDimensionIndex.value === index,
    },
  ])
}
</script>
