<template>
  <div class="du-search" :style="style" @click="handleClick">
    <div class="du-search__left">
      <slot name="left">
        <DuIcon name="search" />
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
        :placeholder="isFocus ? placeholders?.[0] ?? '' : ''"
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
      name="close-circle-filled"
      class="du-search__close"
      @click="handleClear"
    />
    <div class="du-search__right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, provide, onBeforeUnmount } from 'vue'
import DuIcon from '../icon/Icon.vue'
import { dividerInjectionKey } from '../divider/helpers'

const props = withDefaults(
  defineProps<{
    placeholder: string | string[]
    value: string
    clearable: boolean
    bg: string
    readonly: boolean
  }>(),
  {
    placeholder: '',
    value: '',
    clearable: false,
    bg: '',
    readonly: false,
  },
)

const isWeb = __WEB__

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'update:value', value: string): void
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

onBeforeUnmount(() => {
  clearTimeout(timer)
  timer = null
})

function handleInput(e: any) {
  emit('update:value', e.target.value)
}

function handleClear() {
  emit('update:value', '')
}

function handleClick() {
  emit('click')
}

function handlePlaceholderClick() {
  if (!props.readonly) {
    if (inputRef.value) {
      console.log(inputRef)
      console.log('focus')
      inputRef.value.focus()
    }

    // @ts-ignore
    if (typeof uni !== 'undefined') {
      isFocus.value = true
    }
  }
}

function handleFocus() {
  console.log('handle focus')
  isFocus.value = true
}

function handleBlur() {
  console.log('handle blur')
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
</script>
