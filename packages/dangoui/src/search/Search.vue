<template>
  <div class="du-search" :style="style" @click="handleClick">
    <div class="du-search__left">
      <slot name="left">
        <DuIcon :unsafe-internal="searchIcon" />
      </slot>
    </div>
    <div class="du-search__input">
      <div
        v-if="readonly"
        class="du-search__input-inner du-search__input-inner--readonly"
      >
        {{ placeholders.length <= 1 ? placeholders?.[0] ?? '' : '' }}
      </div>
      <input
        v-else-if="isWeb"
        ref="inputRef"
        class="du-search__input-inner"
        :value="value"
        @blur="handleBlur"
        @focus="handleFocus"
        @input="handleInput"
        @keypress="handleKeyPress"
        :placeholder="
          isFocus || placeholders.length <= 1
            ? placeholders?.[currentIndex] ?? ''
            : ''
        "
      />
      <input
        v-else
        class="du-search__input-inner"
        :value="value"
        always-embed
        confirm-type="search"
        :focus="isFocus"
        @blur="handleBlur"
        @focus="handleFocus"
        @input="handleInput"
        @confirm="handleConfirm"
        :placeholder="
          isFocus || placeholders.length <= 1
            ? placeholders?.[currentIndex] ?? ''
            : ''
        "
      />
      <div
        class="du-search__rolling-text"
        v-if="placeholders.length > 1 && !isFocus"
        @click="handlePlaceholderClick"
      >
        <div
          class="du-search__rolling-text-item"
          v-for="(text, idx) in displayPlaceholders"
          :key="idx"
          :style="{
            transform: `translateY(${isNext ? -18 : 0}px)`,
            transition: isNext ? 'transform 0.5s' : 'none',
          }"
        >
          {{ text }}
        </div>
      </div>
    </div>
    <DuIcon
      v-if="value && clearable"
      :unsafe-internal="closeCircleFilledIcon"
      class="du-search__close"
      @click="handleClear"
    />
    <div class="du-search__right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, provide, onBeforeUnmount, onMounted } from 'vue'
import DuIcon from '../icon/Icon.vue'
import { dividerInjectionKey } from '../divider/helpers'
import { iconCloseCircleFilled, iconSearch } from 'dangoui-icon-config'

const props = withDefaults(
  defineProps<{
    /**
     * 占位文字，如果为长度大于 1 的数组，会每隔一段时间切换文字
     */
    placeholder: string | string[]
    /**
     * 输入框的值
     */
    value: string
    /**
     * 是否可清空
     */
    clearable: boolean
    /**
     * 背景色
     */
    bg: string
    /**
     * 只读
     *
     * 你可能想利用这个组件做到点击切换到另一个页面进行搜索
     */
    readonly: boolean
    /**
     * 自动聚焦，拉起键盘
     */
    autofocus: boolean
  }>(),
  {
    placeholder: '',
    value: '',
    clearable: false,
    bg: '',
    readonly: false,
    autofocus: false,
  },
)

const isWeb = __WEB__

const emit = defineEmits<{
  /**
   * 点击整个元素
   */
  (e: 'click', event: any): void
  /**
   * 输入框的值发生变化
   */
  (e: 'update:value', value: string): void
  /**
   * 确认输入框中的内容（点击键盘的搜索按钮）
   */
  (e: 'confirm', value: string): void
}>()

provide(dividerInjectionKey, {
  defaultType: 'vertical',
  length: ref(12),
})

const inputRef = ref<HTMLInputElement>()

const isFocus = ref(false)

const style = computed(() => {
  if (props.bg) {
    return {
      backgroundColor: props.bg,
    }
  }
  return {}
})

const placeholders = computed(() => {
  if (typeof props.placeholder === 'string') {
    return [props.placeholder]
  }
  return props.placeholder
})

const displayPlaceholders = computed(() => {
  if (placeholders.value.length >= 2) {
    if (currentIndex.value === placeholders.value.length - 1) {
      return [placeholders.value[currentIndex.value], placeholders.value[0]]
    }
    return [
      placeholders.value[currentIndex.value],
      placeholders.value[currentIndex.value + 1],
    ]
  }
  return placeholders.value
})

const currentIndex = ref(0)
const isNext = ref(false)
let timer: any = null
function tick() {
  if (!isNext.value) {
    isNext.value = true
    setTimeout(() => {
      currentIndex.value = (currentIndex.value + 1) % placeholders.value.length
      isNext.value = false
    }, 1000)
  }
  timer = setTimeout(tick, 3000)
}
watch(
  () => props.autofocus,
  (newVal) => {
    if (newVal) {
      doFocus()
    }
  },
)
watch(
  [isFocus, placeholders],
  () => {
    if (isFocus.value || placeholders.value.length <= 1) {
      clearTimeout(timer)
      timer = null
    } else {
      if (timer) {
        return
      }
      timer = setTimeout(tick, 3000)
    }
  },
  {
    immediate: true,
  },
)
onMounted(() => {
  if (props.autofocus) {
    doFocus()
  }
})
onBeforeUnmount(() => {
  clearTimeout(timer)
  timer = null
})

function handleInput(e: any) {
  emit('update:value', e?.target?.value || e?.detail?.value)
}

function handleClear() {
  emit('update:value', '')
  emit('confirm', '')
}

function handleClick(event: any) {
  emit('click', event)
}

function handlePlaceholderClick() {
  if (!props.readonly) {
    doFocus()
  }
}
function doFocus() {
  if (inputRef.value) {
    inputRef.value.focus()
  }

  // @ts-ignore
  if (typeof uni !== 'undefined') {
    isFocus.value = true
  }
}
function handleFocus() {
  isFocus.value = true
}

function handleBlur() {
  isFocus.value = false
}

function handleKeyPress(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    emit('confirm', inputRef.value?.value ?? '')
  }
}

function handleConfirm(e: { detail: { value: string } }) {
  emit('confirm', e.detail.value)
}

const closeCircleFilledIcon = (function () {
  if (__WEB__) {
    return iconCloseCircleFilled
  } else {
    return 'close-circle-filled'
  }
})()

const searchIcon = (function () {
  if (__WEB__) {
    return iconSearch
  } else {
    return 'search'
  }
})()
</script>
