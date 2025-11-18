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
    <Popup
      :title="title"
      v-model:visible="visible"
      type="bottom"
      :style="internalStyle"
    >
      <div>
        <div v-if="showSearch" class="du-cascader__search">
          <Search
            :placeholder="searchPlaceholder"
            clearable
            v-model:value="keyword"
          />
        </div>
        <template v-if="keyword?.trim()">
          <scroll-view class="du-cascader__options" scroll-y>
            <div
              v-for="result in searchResults"
              :key="result.path.join('/')"
              class="du-cascader__option du-cascader__option--search"
              @click="handleSelectSearchResult(result)"
            >
              <div class="du-cascader__option-path">
                <template v-for="(segment, idx) in result.segments" :key="idx">
                  <span v-if="idx > 0" class="du-cascader__option-separator">
                    /
                  </span>
                  <span
                    v-for="(part, partIdx) in segment.parts"
                    :key="partIdx"
                    :class="{ 'du-cascader__option-highlight': part.highlight }"
                  >
                    {{ part.text }}
                  </span>
                </template>
              </div>
              <DuIcon :unsafe-internal="arrowHeavyRightIcon" :size="12" />
            </div>
            <div v-if="searchResults.length === 0" class="du-cascader__empty">
              暂无数据
            </div>
          </scroll-view>
        </template>
        <template v-else>
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
              <slot name="option" :option="opt">
                {{ opt.label }}
              </slot>
              <DuIcon :unsafe-internal="arrowHeavyRightIcon" :size="12" />
            </div>
          </scroll-view>
        </template>
      </div>
    </Popup>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch, normalizeStyle } from 'vue'
import Popup from '../popup/Popup.vue'
import Search from '../search/Search.vue'
import Tabs from '../tabs/Tabs.vue'
import Tab from '../tabs/Tab.vue'
import FormField from '../form/FormField.vue'
import DuIcon from '../icon/Icon.vue'
import { formItemLayoutInjectionKey } from '../form/helpers'
import { iconArrowHeavyRight } from 'dangoui-icon-config'
import {
  flattenOptions,
  SearchResult,
  SearchResultSegment,
  highlightText,
  type CascaderOption,
} from './helpers'

const props = withDefaults(
  defineProps<{
    title: string
    open?: boolean
    options: CascaderOption[]
    value: string[]
    showSearch?: boolean
    searchPlaceholder?: string
    popupStyle?: string | Record<string, string>
  }>(),
  {
    open: undefined,
    title: '请选择',
    value: () => [],
    popupStyle: '',
    showSearch: false,
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

const formItemLayout = inject(formItemLayoutInjectionKey, null)

const isInFormItem = !!formItemLayout

const internalOpen = ref(false)
const internalValue = ref<string[]>([])
const tabIndex = ref('1')
const keyword = ref('')

const internalStyle = computed(() => {
  return normalizeStyle([
    {
      'max-height': '80vh',
      'overflow-y': 'auto',
    },
    props.popupStyle,
  ])
})

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

watch(visible, (val) => {
  if (val) {
    internalValue.value = [...props.value]
    let currentOptions: CascaderOption[] | undefined = props.options
    let lastValidOptions: CascaderOption[] | undefined = props.options

    for (let i = 0; i < internalValue.value.length; i++) {
      const found: CascaderOption | undefined = currentOptions?.find(
        (opt) => opt.value === internalValue.value[i],
      )
      if (found) {
        lastValidOptions = currentOptions
        currentOptions = found.children
      } else {
        internalValue.value.length = i
        currentOptions = lastValidOptions
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

const flattenedOptions = computed(() => {
  return flattenOptions(props.options)
})

const searchResults = computed<SearchResult[]>(() => {
  const kw = keyword.value?.trim()
  if (!kw) {
    return []
  }

  const results: SearchResult[] = []

  for (const flatOption of flattenedOptions.value) {
    const matchesKeyword = flatOption.labels.some((label) =>
      label.toLowerCase().includes(kw.toLowerCase()),
    )

    if (matchesKeyword) {
      const segments: SearchResultSegment[] = flatOption.labels.map(
        (label) => ({
          parts: highlightText(label, kw),
        }),
      )

      results.push({
        path: flatOption.path,
        labels: flatOption.labels,
        segments,
      })
    }
  }

  return results
})

function handleSelectOption(opt: CascaderOption) {
  const idx = +tabIndex.value
  internalValue.value.length = idx
  internalValue.value[idx - 1] = opt.value

  if (opt.children) {
    tabIndex.value = `${idx + 1}`
  } else {
    emit('update:value', [...internalValue.value])
    emit('confirm', getOptionsFromValue(internalValue.value))
    visible.value = false
  }
}

function handleSelectSearchResult(result: SearchResult) {
  internalValue.value = [...result.path]
  emit('update:value', [...result.path])
  emit('confirm', getOptionsFromValue(result.path))
  visible.value = false
  keyword.value = ''
}

const arrowHeavyRightIcon = (function () {
  if (__WEB__) {
    return iconArrowHeavyRight
  } else {
    return 'arrow-heavy-right'
  }
})()
</script>
