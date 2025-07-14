<template>
  <Popup v-model:visible="popupVisible" type="top" :closable="false">
    <div>
      <!-- 筛选维度选择栏 -->
      <div v-if="filterField.length > 1" class="du-dropdown__filter-fields">
        <div
          v-for="(field, index) in filterField"
          :key="field.value"
          :class="filterFieldClassName(index)"
          @click="handleFilterFieldChange(index)"
        >
          <div>{{ field.label }}</div>
          <DuIcon name="arrowdown" :size="8" />
        </div>
      </div>
      <DuDivider v-if="filterField.length > 1" />

      <!-- 选项内容区 -->
      <div class="du-dropdown__content">
        <template v-if="currentFilterField">
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
     * 筛选维度配置
     */
    filterField: FilterField[]
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
const currentFilterFieldIndex = ref(0)

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      internalValue.value = JSON.parse(JSON.stringify(props.value))
    } else {
      currentFilterFieldIndex.value = 0
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

const currentFilterField = computed(
  () => props.filterField[currentFilterFieldIndex.value],
)

const currentGroups = computed(() => {
  const field = currentFilterField.value
  if (!field) return []
  if ('options' in field) {
    return [
      {
        label: field.label,
        value: field.value,
        multiple: field.multiple,
        options: field.options,
      },
    ]
  }
  return field.groups
})

function isSelected(option: DropdownOption, group: OptionGroup): boolean {
  const field = currentFilterField.value
  if (!field) return false

  const fieldValue = internalValue.value[field.value]
  if (!fieldValue) return false

  if (Array.isArray(fieldValue)) {
    return fieldValue.some((opt: DropdownOption) => opt.value === option.value)
  }

  const groupOptions = fieldValue[group.value]
  if (!groupOptions) return false

  return groupOptions.some((opt: DropdownOption) => opt.value === option.value)
}

function handleSelect(option: DropdownOption, group: OptionGroup) {
  const field = currentFilterField.value
  if (!field) return

  const fieldValue = field.value

  const isMultiple = 'multiple' in group ? group.multiple : field.multiple

  if ('options' in field) {
    // 处理直接有options的情况
    let currentOptions: DropdownOption[]

    if (
      !internalValue.value[fieldValue] ||
      !Array.isArray(internalValue.value[fieldValue])
    ) {
      currentOptions = []
      internalValue.value = {
        ...internalValue.value,
        [fieldValue]: currentOptions,
      }
    } else {
      currentOptions = internalValue.value[fieldValue]
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
      internalValue.value[fieldValue] = [option]
    }
  } else {
    // 处理有groups的情况
    let filterValue: Record<string, DropdownOption[]>

    if (
      !internalValue.value[fieldValue] ||
      Array.isArray(internalValue.value[fieldValue])
    ) {
      filterValue = {}
      internalValue.value = {
        ...internalValue.value,
        [fieldValue]: filterValue,
      }
    } else {
      filterValue = internalValue.value[fieldValue]
    }

    if (!filterValue[group.value]) {
      filterValue[group.value] = []
    }

    const groupOptions = filterValue[group.value]
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
      filterValue[group.value] = [option]
    }
  }
  internalValue.value = { ...internalValue.value }
}

function handleFilterFieldChange(index: number) {
  currentFilterFieldIndex.value = index
}

function handleCancel() {
  internalValue.value = JSON.parse(JSON.stringify(props.value))
  popupVisible.value = false
}

function handleConfirm() {
  const selectedOptions: SelectedValue = {}

  props.filterField.forEach((field) => {
    const fieldValue = field.value
    const filterValue = internalValue.value[fieldValue] || {}

    // 处理直接有options的情况
    if ('options' in field) {
      const options = filterValue as DropdownOption[]
      selectedOptions[fieldValue] = options || []
    } else {
      // 处理有groups的情况
      const groupedValue = filterValue as Record<string, DropdownOption[]>
      selectedOptions[fieldValue] = groupedValue
    }
  })
  popupVisible.value = false
  emit('update:value', selectedOptions)
  emit('confirm', selectedOptions)
}

const hasSelected = computed(() => {
  const fieldValues = internalValue.value || {}
  return Object.values(fieldValues).some((fieldValue) => {
    if (Array.isArray(fieldValue)) {
      return fieldValue.length > 0
    }
    return Object.values(fieldValue).some(
      (groupValue) => Array.isArray(groupValue) && groupValue.length > 0,
    )
  })
})

function filterFieldClassName(index: number) {
  return normalizeClass([
    'du-dropdown__filter-field',
    {
      'du-dropdown__filter-field--active':
        currentFilterFieldIndex.value === index,
    },
  ])
}
</script>
