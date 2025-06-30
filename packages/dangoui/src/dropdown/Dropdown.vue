<template>
  <Popup v-model:visible="popupVisible" type="top" :closable="false">
    <div class="du-dropdown">
      <!-- 筛选维度选择栏 -->
      <div class="du-dropdown__dimensions">
        <div
          v-for="(dimension, index) in dimensions"
          :key="dimension.title"
          :class="[
            'du-dropdown__dimension',
            {
              'du-dropdown__dimension--active': currentDimensionIndex === index,
            },
          ]"
          @click="handleDimensionChange(index)"
        >
          {{ dimension.title }}
        </div>
      </div>

      <!-- 当前维度标题 -->
      <div class="du-dropdown__title" v-if="currentDimension">
        {{ currentDimension.title }}
      </div>

      <!-- 选项内容区 -->
      <div class="du-dropdown__content">
        <template v-if="currentDimension">
          <div
            v-for="group in currentDimension.groups"
            :key="group.title"
            class="du-dropdown__group"
          >
            <div class="du-dropdown__group-title">
              {{ group.title }}
              <span class="du-dropdown__subtitle">
                {{ group.multiple ? '(可多选)' : '(单选)' }}
              </span>
            </div>
            <div class="du-dropdown__tags">
              <DuTag
                v-for="option in group.options"
                :key="option.value"
                :class="[
                  'du-dropdown__tag',
                  {
                    'du-dropdown__tag--selected': isSelected(option, group),
                    'du-dropdown__tag--disabled': option.disabled,
                  },
                ]"
                :color="isSelected(option, group) ? 'primary' : 'default'"
                @click="handleSelect(option, group)"
              >
                <span class="du-tag__content">
                  {{ option.label }}
                </span>
              </DuTag>
            </div>
          </div>
        </template>
      </div>

      <!-- 底部按钮 -->
      <div class="du-dropdown__footer">
        <DuButton
          type="primary"
          size="large"
          full
          :disabled="!hasSelected"
          @click="handleConfirm"
        >
          确定
        </DuButton>
      </div>
    </div>
  </Popup>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Popup from '../popup/Popup.vue'
import DuButton from '../button/Button.vue'
import DuTag from '../tag/Tag.vue'

// 选项类型
export type DropdownOption = {
  label: string
  value: string
  disabled?: boolean
}

// 选项分组类型
export type OptionGroup = {
  title: string
  multiple?: boolean
  options: DropdownOption[]
}

// 筛选维度类型
export type FilterDimension = {
  title: string
  groups: OptionGroup[]
}

const props = withDefaults(
  defineProps<{
    dimensions: FilterDimension[]
    value: Record<string, Record<string, string[]>>
    visible: boolean
  }>(),
  {
    value: () => ({}),
  },
)

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (e: 'update:value', value: Record<string, Record<string, string[]>>): void
  (e: 'confirm', value: Record<string, Record<string, DropdownOption[]>>): void
}>()

const internalValue = ref<Record<string, Record<string, string[]>>>({})
const currentDimensionIndex = ref(0)

// 获取当前维度
const currentDimension = computed(
  () => props.dimensions[currentDimensionIndex.value],
)

// 检查选项是否被选中
function isSelected(option: DropdownOption, group: OptionGroup): boolean {
  const dimension = currentDimension.value
  if (!dimension) return false

  const dimensionValue = internalValue.value[dimension.title] || {}
  const groupValue = dimensionValue[group.title] || []
  return groupValue.includes(option.value)
}

// 处理选项选择
function handleSelect(option: DropdownOption, group: OptionGroup) {
  if (option.disabled) return

  const dimension = currentDimension.value
  if (!dimension) return

  // 确保维度值和组值都是有效的对象和数组
  const dimensionTitle = dimension.title
  const groupTitle = group.title

  if (!internalValue.value[dimensionTitle]) {
    internalValue.value = {
      ...internalValue.value,
      [dimensionTitle]: {},
    }
  }

  const dimensionValue = internalValue.value[dimensionTitle]
  if (!dimensionValue[groupTitle]) {
    dimensionValue[groupTitle] = []
  }

  const groupValue = dimensionValue[groupTitle]
  const index = groupValue.indexOf(option.value)

  if (group.multiple) {
    // 多选模式
    if (index > -1) {
      groupValue.splice(index, 1)
    } else {
      groupValue.push(option.value)
    }
  } else {
    // 单选模式直接替换
    groupValue.length = 0
    groupValue.push(option.value)
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

  const selectedOptions: Record<string, Record<string, DropdownOption[]>> = {}
  props.dimensions.forEach((dimension) => {
    const dimensionTitle = dimension.title
    const dimensionValue = currentValue[dimensionTitle] || {}
    selectedOptions[dimensionTitle] = {}

    dimension.groups.forEach((group) => {
      const groupTitle = group.title
      const groupValue = dimensionValue[groupTitle] || []
      selectedOptions[dimensionTitle][groupTitle] = group.options.filter(
        (option) => groupValue.includes(option.value),
      )
    })
  })
  console.log(selectedOptions)
  popupVisible.value = false
  emit('confirm', selectedOptions)
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

// 监听可见性变化
watch(
  () => props.visible,
  (val) => {
    if (val) {
      // 确保初始值是一个有效的对象
      internalValue.value = props.value ? { ...props.value } : {}
      currentDimensionIndex.value = 0
    }
  },
)
</script>

<style lang="scss">
.du-dropdown {
  display: flex;
  flex-direction: column;
  max-height: 70vh;

  &__dimensions {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--du-border-color);
    overflow-x: auto;
    position: sticky;
    top: 0;
    background: var(--du-bg-color);
    z-index: 1;
  }

  &__dimension {
    padding: 6px 12px;
    font-size: 14px;
    color: var(--du-text-color-secondary);
    cursor: pointer;
    white-space: nowrap;
    border-radius: 16px;
    transition: all 0.2s;

    &:not(:last-child) {
      margin-right: 8px;
    }

    &--active {
      color: var(--du-primary-color);
      background: var(--du-primary-color-light);
    }
  }

  &__title {
    padding: 16px 16px 8px;
    font-size: 16px;
    font-weight: 500;
    color: var(--du-text-color);
  }

  &__subtitle {
    font-size: 12px;
    color: var(--du-text-color-secondary);
    font-weight: normal;
    margin-left: 4px;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    padding: 12px 16px;
  }

  &__group {
    & + & {
      margin-top: 16px;
    }
  }

  &__group-title {
    font-size: 14px;
    color: var(--du-text-color);
    margin-bottom: 12px;
  }

  &__tags {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  &__tag {
    cursor: pointer;
    width: 100%;
    height: 40px;
    text-align: left;
    padding: 4px 12px;
    display: flex;
    align-items: center;

    :deep(.du-tag__content) {
      flex: 1;
      min-width: 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      line-height: 1.2;
      font-size: 14px;
    }

    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__footer {
    padding: 16px;
    border-top: 1px solid var(--du-border-color);
  }
}
</style>
