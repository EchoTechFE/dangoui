<template>
  <div>
    <slot :open="handleOpen">
      <div v-if="isInFormItem">
        <FormField
          :text="selectedText"
          :placeholder="title"
          @click="handleOpen"
        />
      </div>
    </slot>
    <Popup :title="title" v-model:visible="visible" type="bottom">
      <div>
        <Tabs v-model:value="tabIndex">
          <Tab v-for="tab in currentTabs" :key="tab.name" :name="tab.name">
            {{ tab.label }}
          </Tab>
        </Tabs>
        <scroll-view class="du-cascader__options" scroll-y>
          <div
            v-for="opt in displayOptions"
            :key="opt.value"
            class="du-cascader__option"
            @click="handleSelectOption(opt)"
          >
            <div>{{ opt.label }}</div>
            <DuIcon name="arrow-heavy-right" size="12px" />
          </div>
        </scroll-view>
      </div>
    </Popup>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import Popup from '../popup/Popup.vue'
import Tabs from '../tabs/Tabs.vue'
import Tab from '../tabs/Tab.vue'
import FormField from '../form/FormField.vue'
import DuIcon from '../icon/Icon.vue'
import { formItemLayoutInjectionKey } from '../form/helpers'

export type CascaderOption = {
  label: string
  value: string
  disabled?: boolean
  children?: CascaderOption[]
}

const props = withDefaults(
  defineProps<{
    title: string
    open?: boolean
    options: CascaderOption[]
    value: string[]
  }>(),
  {
    open: undefined,
    title: '请选择',
    value: () => [],
  },
)

const emit = defineEmits<{
  (e: 'update:open', open: boolean): void
  (e: 'update:value', value: string[]): void
  /**
   * 如果你需要获取选中数据的 label，可以使用这个事件
   */
  (e: 'confirm', value: CascaderOption[]): void
}>()

const formItemLayout = inject(formItemLayoutInjectionKey)

const isInFormItem = !!formItemLayout

const internalOpen = ref(false)
const internalValue = ref<string[]>([])
const tabIndex = ref('1')

const visible = computed({
  get() {
    return props.open ?? internalOpen.value
  },
  set(val) {
    console.log(val, props.open)
    if (props.open == null) {
      internalOpen.value = val
    }
    emit('update:open', val)
  },
})

watch(visible, (val) => {
  if (val) {
    internalValue.value = [...props.value]
    let currentOptions: CascaderOption[] | undefined = props.options
    for (let i = 0; i < internalValue.value.length; i++) {
      const found: CascaderOption | undefined = currentOptions?.find(
        (opt) => opt.value === internalValue.value[i],
      )
      if (found) {
        currentOptions = found.children
      } else {
        break
      }
    }
    if (currentOptions) {
      tabIndex.value = `${internalValue.value.length + 1}`
    } else {
      tabIndex.value = `${internalValue.value.length}`
    }
  }
})

const currentTabs = computed(() => {
  const items: { name: string; label: string }[] = []
  const value = [...internalValue.value]
  let currentOptions: CascaderOption[] | undefined = props.options
  let idx = 1

  while (value.length > 0) {
    const selected = value.shift()
    const found: CascaderOption | undefined = currentOptions?.find(
      (opt) => opt.value === selected,
    )
    if (found) {
      items.push({
        name: `${idx++}`,
        label: found.label,
      })
      currentOptions = found?.children
    } else {
      return items
    }
  }

  if (currentOptions) {
    items.push({
      name: `${idx++}`,
      label: '请选择',
    })
  }

  return items
})

const displayOptions = computed(() => {
  const idx = +tabIndex.value
  let currentOptions = props.options
  for (let i = 0; i < idx; i++) {
    const selected = internalValue.value[i]
    if (selected == null) {
      return currentOptions
    }
    const found: CascaderOption | undefined = currentOptions.find(
      (opt) => opt.value === selected,
    )
    if (found) {
      if (i === idx - 1) {
        // 如果是最后一个
        return currentOptions
      } else {
        currentOptions = found.children || []
      }
    } else {
      return []
    }
  }

  return currentOptions
})

function handleOpen() {
  visible.value = true
}

function getOptionsFromValue(value: string[]) {
  const options: CascaderOption[] = []

  let currentOptions: CascaderOption[] | undefined = props.options
  for (let i = 0; i < value.length; i++) {
    const selected = value[i]
    const found: CascaderOption | undefined = currentOptions?.find(
      (opt) => opt.value === selected,
    )
    if (found) {
      options.push(found)
      currentOptions = found.children
    } else {
      break
    }
  }

  return options
}

const selectedText = computed(() => {
  const options = getOptionsFromValue(props.value)
  return options.map((opt) => opt.label).join('/')
})

function handleSelectOption(opt: CascaderOption) {
  const idx = +tabIndex.value
  internalValue.value.length = idx
  internalValue.value[idx - 1] = opt.value
  console.log('internalValue', internalValue.value)

  if (opt.children) {
    tabIndex.value = `${idx + 1}`
  } else {
    console.log('confirm', [...internalValue.value])
    emit('update:value', [...internalValue.value])
    emit('confirm', getOptionsFromValue(internalValue.value))
    visible.value = false
  }
  console.log('tab Index', tabIndex.value)
}
</script>
