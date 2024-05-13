<template>
  <div>
    <div
      v-if="isWeb"
      ref="placeholder"
      class="du-picker-view__item"
      style="position: absolute; visibility: hidden"
    />
    <div class="du-picker-view">
      <div class="du-picker-view__indicator" />
      <div
        v-for="(col, colIdx) in columns"
        class="du-picker-view__col"
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
            'du-picker-view__item',
            { 'du-picker-view__item--active': idx === selectedIdx[colIdx] },
          ]"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="du-picker-view__mask" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    columns: { label: string; value: string }[][]
    value: string[]
  }>(),
  {},
)

const emit = defineEmits<{
  (e: 'update:value', value: string[]): void
}>()

const isWeb = __WEB__

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

const originalY = ref(0)
const currentY = ref(0)
const isMoving = ref(false)
const movingIdx = ref(-1)
const selectedIdx = ref<number[]>([])

watch(
  [() => props.value, () => props.columns],
  ([value, columns]) => {
    selectedIdx.value = value.map((v, i) => {
      const idx = columns[i].findIndex((col) => col.value === v)
      return idx
    })
  },
  {
    immediate: true,
  },
)

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

  emit(
    'update:value',
    selectedIdx.value.map((idx, i) => props.columns[i][idx].value),
  )
}
</script>
