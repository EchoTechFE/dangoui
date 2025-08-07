<template>
  <div>
    <div
      v-if="isWeb"
      ref="placeholder"
      class="du-picker__item"
      style="position: absolute; visibility: hidden"
    />
    <slot :open="handleOpen">
      <div v-if="isInFormItem">
        <FormField
          :text="selectedText"
          :placeholder="title"
          @click="handleOpen"
        />
      </div>
    </slot>
    <DuPopup v-model:visible="visible" type="bottom" :header-visible="false">
      <div class="du-picker__header">
        <DuButton
          type="text"
          color="default"
          size="large"
          @click="handleCancel"
        >
          取消
        </DuButton>
        <div class="du-picker__title">{{ title }}</div>
        <DuButton
          type="text"
          color="primary"
          size="large"
          @click="handleConfirm"
        >
          确认
        </DuButton>
      </div>
      <div class="du-picker">
        <div class="du-picker__indicator" />
        <div
          v-for="(col, colIdx) in columns"
          class="du-picker__col"
          :style="{
            transform: `translateY(${transformY[colIdx]})`,
            transition: isMoving && movingIdx === colIdx ? 'none' : 'all 0.25s',
          }"
          @touchstart="handleTouchStart(colIdx, $event)"
          @touchmove.stop.prevent="handleTouchMove"
          @touchend="handleTouchEnd"
          @touchcancel="handleTouchEnd"
        >
          <div
            v-for="(item, idx) in col"
            :key="item.value"
            :class="[
              'du-picker__item',
              { 'du-picker__item--active': idx === selectedIdx[colIdx] },
            ]"
          >
            {{ item.label }}
          </div>
        </div>
        <div class="du-picker__mask" />
      </div>
    </DuPopup>
  </div>
</template>

<script setup lang="ts">
import DuPopup from '../popup/Popup.vue'
import DuButton from '../button/Button.vue'
import FormField from '../form/FormField.vue'
import { formItemLayoutInjectionKey } from '../form/helpers'

import { computed, inject, onMounted, ref } from 'vue'

const isWeb = __WEB__

const props = withDefaults(
  defineProps<{
    columns: { label: string; value: string }[][]
    value: string[]
    title: string
    open?: boolean
  }>(),
  {
    open: undefined,
    title: '请选择',
  },
)

const emit = defineEmits<{
  (e: 'update:value', value: string[]): void
  (e: 'update:open', open: boolean): void
}>()

const placeholder = ref<HTMLDivElement | null>(null)

const itemHeight = ref(44)

onMounted(() => {
  if (__WEB__) {
    itemHeight.value = placeholder.value!.getBoundingClientRect().height
  } else {
    const systemInfo = uni.getSystemInfoSync()
    itemHeight.value = (systemInfo.windowWidth * 44) / 375
  }
})

const formItemLayout = inject(formItemLayoutInjectionKey, null)

const isInFormItem = !!formItemLayout

const internalOpen = ref(false)

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

const originalY = ref(0)
const currentY = ref(0)
const isMoving = ref(false)
const movingIdx = ref(-1)
const selectedIdx = ref<number[]>([])

const transformY = computed(() => {
  return props.columns.map((_, idx) => {
    if (isMoving.value && movingIdx.value === idx) {
      const offset =
        currentY.value -
        originalY.value -
        (selectedIdx.value[idx] ?? 0) * itemHeight.value
      return `${offset}px`
    }
    return `${-(selectedIdx.value[idx] ?? 0) * itemHeight.value}px`
  })
})

function handleTouchStart(idx: number, e: TouchEvent) {
  isMoving.value = true
  movingIdx.value = idx
  originalY.value = e.touches[0].clientY
  currentY.value = e.touches[0].clientY
}

function handleTouchMove(e: TouchEvent) {
  currentY.value = e.touches[0].clientY
}

function handleTouchEnd() {
  const delta = currentY.value - originalY.value
  const idx = Math.round(-delta / itemHeight.value)
  selectedIdx.value[movingIdx.value] =
    (selectedIdx.value[movingIdx.value] ?? 0) + idx
  if (
    selectedIdx.value[movingIdx.value] >= props.columns[movingIdx.value].length
  ) {
    selectedIdx.value[movingIdx.value] =
      props.columns[movingIdx.value].length - 1
  }
  if (selectedIdx.value[movingIdx.value] < 0) {
    selectedIdx.value[movingIdx.value] = 0
  }
  isMoving.value = false
  movingIdx.value = -1
  originalY.value = 0
  currentY.value = 0
}

function handleConfirm() {
  if (isMoving.value) {
    return
  }

  const v = props.columns.map((_, idx) => {
    return props.columns[idx][selectedIdx.value[idx] ?? 0].value
  })
  emit('update:value', v)
  emit('update:open', false)
}

function handleCancel() {
  emit('update:open', false)
}

const selectedText = computed(() => {
  return props.value
    .map((v, idx) => {
      const found = props.columns[idx].find((col) => col.value === v)
      if (found) {
        return found.label
      }
    })
    .filter((v) => !!v)
    .join('/')
})

function handleOpen() {
  visible.value = true
}
</script>
