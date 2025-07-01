<template>
  <Popup
    v-model:visible="popupVisible"
    type="top"
    :closable="false"
    :extClass="extClass"
    :extStyle="extStyle"
  >
    <div :class="className" :style="style">
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
                  :class="tagClassName(option, group)"
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
import { computed, ref, watch, normalizeClass, normalizeStyle } from 'vue'
import Popup from '../popup/Popup.vue'
import DuButton from '../button/Button.vue'
import DuTag from '../tag/Tag.vue'
import DuDivider from '../divider/Divider.vue'
import DuIcon from '../icon/Icon.vue'

// 选项类型
export type DropdownOption = {
  label: string
  value: string
}

// 选项分组类型
export type OptionGroup = {
  label: string
  value: string
  multiple?: boolean
  options: DropdownOption[]
}

// 筛选维度类型
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

const props = withDefaults(
  defineProps<{
    /**
     * 筛选维度配置
     */
    dimensions: FilterDimension[]
    /**
     * 当前选中的值
     */
    value: Record<string, Record<string, string[]>>
    /**
     * 是否显示
     */
    visible: boolean
    /**
     * 自定义 class
     */
    extClass?: string | string[] | Record<string, boolean>
    /**
     * 自定义 style
     */
    extStyle?: string | { [x: string]: string | number }
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
  (e: 'update:value', value: Record<string, Record<string, string[]>>): void
  (
    e: 'confirm',
    value: Record<string, DropdownOption[] | Record<string, DropdownOption[]>>,
  ): void
}>()

const internalValue = ref<Record<string, Record<string, string[]>>>({})
const currentDimensionIndex = ref(0)

// 同步外部value到内部状态
watch(
  () => props.value,
  (newValue) => {
    internalValue.value = { ...newValue }
  },
  { immediate: true },
)

// 监听可见性变化，重置当前维度索引
watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      // 打开时同步一次值
      internalValue.value = { ...props.value }
    } else {
      // 关闭时重置索引
      currentDimensionIndex.value = 0
    }
  },
)

// 获取当前维度
const currentDimension = computed(
  () => props.dimensions[currentDimensionIndex.value],
)

// 获取当前维度的选项组
const currentGroups = computed(() => {
  const dimension = currentDimension.value
  if (!dimension) return []

  // 如果直接有options，构造一个默认的group
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

// 检查选项是否被选中
function isSelected(option: DropdownOption, group: OptionGroup): boolean {
  const dimension = currentDimension.value
  if (!dimension) return false

  const dimensionValue = internalValue.value[dimension.value] || {}
  const groupValue = dimensionValue[group.value] || []
  return groupValue.includes(option.value)
}

// 处理选项选择
function handleSelect(option: DropdownOption, group: OptionGroup) {
  const dimension = currentDimension.value
  if (!dimension) return

  const dimensionValue = dimension.value
  const groupValue = group.value

  if (!internalValue.value[dimensionValue]) {
    internalValue.value = {
      ...internalValue.value,
      [dimensionValue]: {},
    }
  }

  const dimValue = internalValue.value[dimensionValue]
  if (!dimValue[groupValue]) {
    dimValue[groupValue] = []
  }

  const grpValue = dimValue[groupValue]
  const index = grpValue.indexOf(option.value)

  // 使用group或dimension的multiple配置
  const isMultiple = 'multiple' in group ? group.multiple : dimension.multiple

  if (isMultiple) {
    // 多选模式
    if (index > -1) {
      grpValue.splice(index, 1)
    } else {
      grpValue.push(option.value)
    }
  } else {
    // 单选模式直接替换
    grpValue.length = 0
    grpValue.push(option.value)
  }

  // 触发响应式更新
  internalValue.value = { ...internalValue.value }
}

// 处理维度切换
function handleDimensionChange(index: number) {
  currentDimensionIndex.value = index
}

// 处理确认按钮点击
function handleConfirm() {
  const currentValue = internalValue.value || {}
  emit('update:value', { ...currentValue })

  const selectedOptions: Record<string, any> = {}
  props.dimensions.forEach((dimension) => {
    const dimensionValue = dimension.value
    const dimValue = currentValue[dimensionValue] || {}

    // 处理直接有options的情况 - 返回扁平结构
    if ('options' in dimension) {
      const grpValue = dimValue[dimensionValue] || []
      selectedOptions[dimensionValue] = dimension.options.filter((option) =>
        grpValue.includes(option.value),
      )
    } else {
      // 处理有groups的情况 - 返回嵌套结构
      selectedOptions[dimensionValue] = {}
      dimension.groups.forEach((group) => {
        const groupValue = group.value
        const grpValue = dimValue[groupValue] || []
        selectedOptions[dimensionValue][groupValue] = group.options.filter(
          (option) => grpValue.includes(option.value),
        )
      })
    }
  })
  popupVisible.value = false
  emit('confirm', selectedOptions)
}

function handleCancel() {
  popupVisible.value = false
}

// 计算是否有选中项
const hasSelected = computed(() => {
  const dimensionValues = internalValue.value || {}
  return Object.values(dimensionValues).some(
    (dimensionValue) =>
      dimensionValue &&
      Object.values(dimensionValue).some(
        (groupValue) => Array.isArray(groupValue) && groupValue.length > 0,
      ),
  )
})

const popupVisible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit('update:visible', val)
  },
})

// 组件样式类名
const className = computed(() => {
  return normalizeClass(['du-dropdown', props.extClass])
})

// 组件样式
const style = computed(() => {
  return normalizeStyle(props.extStyle)
})

// 维度标签样式类名
function dimensionClassName(index: number) {
  return normalizeClass([
    'du-dropdown__dimension',
    {
      'du-dropdown__dimension--active': currentDimensionIndex.value === index,
    },
  ])
}

// 选项标签样式类名
function tagClassName(option: DropdownOption, group: OptionGroup) {
  return normalizeClass([
    'du-dropdown__tag',
    {
      'du-dropdown__tag--selected': isSelected(option, group),
    },
  ])
}
</script>

<style lang="scss">
@import './style.scss';
</style>
