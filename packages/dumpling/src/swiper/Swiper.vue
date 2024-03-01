<template>
  <div :class="className" :style="style">
    <div
      v-if="inited"
      class="du-swiper__wrapper"
      :style="{
        transform: `translateX(${transformX}px)`,
        transition: isMoving ? 'none' : 'all 0.25s',
      }"
      @touchstart="handleTouchStart"
      @touchmove.stop.prevent="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchEnd"
    >
      <slot />
    </div>
    <template v-if="count > 1">
      <div v-if="indicatorType === 'number'" class="du-swiper__num-indicator">
        {{ logicalIndex }}/{{ count }}
      </div>
      <div
        v-else
        :class="`du-swiper__indicator du-swiper__indicator--${indicatorType}`"
      >
        <div
          v-for="idx in count"
          :class="[
            `du-swiper__indicator-item du-swiper__indicator-item--${indicatorType}`,
            (idx - 1 === currentIndex ||
              (currentIndex === -1 && idx === count) ||
              (currentIndex === count && idx === 1)) &&
              'du-swiper__indicator-item--active',
          ]"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  options: {
    virtualHost: true,
  },
}
</script>

<script setup lang="ts">
// TODO: 使用 wxs，但是要考虑项目要怎么维护有 wxs 的组件以及重复的逻辑...
import {
  getCurrentInstance,
  provide,
  ref,
  onMounted,
  computed,
  normalizeClass,
  normalizeStyle,
  watch,
} from 'vue'
import { swiperInjectionKey } from './helpers'

const props = withDefaults(
  defineProps<{
    /**
     * 指示条类型
     */
    indicatorType: 'bar-full' | 'bar' | 'number'
    extClass: string | string[] | Record<string, boolean>
    /**
     * 自动轮播
     */
    autoplay: boolean
    extStyle:
      | string
      | {
          [x: string]: string | number
        }
  }>(),
  {
    indicatorType: 'bar',
    extClass: '',
    autoplay: false,
    extStyle: '',
  },
)

const className = computed(() => {
  return normalizeClass([
    'du-swiper',
    (currentIndex.value === 0 || currentIndex.value === -1) &&
      count.value > 1 &&
      'du-swiper--first',
    currentIndex.value >= count.value - 1 &&
      count.value > 1 &&
      'du-swiper--last',
    props.extClass,
  ])
})

const style = computed(() => {
  const { extStyle } = props
  return normalizeStyle([
    {
      '--du-swiper-offset': `-${width.value * count.value}px`,
    },
    extStyle,
  ])
})

const instance = getCurrentInstance()

const inited = ref(false)
const width = ref(0)
const height = ref(0)

onMounted(() => {
  if (__WEB__) {
    const $ = instance!.proxy!.$el as HTMLDivElement
    const rect = $.getBoundingClientRect()
    inited.value = true
    width.value = rect.width
    height.value = rect.height
  } else {
    const query = uni.createSelectorQuery().in(instance?.proxy)
    query
      .select('.du-swiper')
      .boundingClientRect()
      .exec((res) => {
        inited.value = true
        width.value = res[0].width
        height.value = res[0].height
      })
  }
})

const count = ref(0)

function add(n: number) {
  count.value = count.value + n
}

provide(swiperInjectionKey, {
  add,
  width,
  height,
})

const originalX = ref(0)
const currentX = ref(0)
const isMoving = ref(false)
const isDragging = ref(false)
const currentIndex = ref(0)
let start = 0

let timeoutId: any = null

watch(
  [() => props.autoplay, isDragging],
  ([$autoplay, $isDragging], _, onCleanup) => {
    if ($autoplay && !$isDragging) {
      const tick = () => {
        goNext()
        timeoutId = setTimeout(tick, 3000)
      }
      timeoutId = setTimeout(() => {
        tick()
      }, 3000)
    }
    onCleanup(() => {
      clearTimeout(timeoutId)
    })
  },
  {
    immediate: true,
  },
)

const logicalIndex = computed(() => {
  if (currentIndex.value >= count.value) {
    return 1
  }
  if (currentIndex.value === -1) {
    return count.value
  }
  return currentIndex.value + 1
})

const delta = computed(() => {
  const diff = currentX.value - originalX.value
  if (Math.abs(diff) > width.value) {
    return diff > 0 ? width.value : -width.value
  }
  return diff
})

const transformX = computed(() => {
  return currentIndex.value * -1 * width.value + delta.value
})

function handleTouchStart(e: TouchEvent) {
  if (count.value <= 1) {
    return
  }
  start = Date.now()
  isMoving.value = true
  isDragging.value = true
  currentX.value = e.touches[0].clientX
  originalX.value = e.touches[0].clientX
}

function handleTouchMove(e: TouchEvent) {
  if (count.value <= 1) {
    return
  }
  currentX.value = e.touches[0].clientX
}

function goPrevious() {
  if (count.value <= 1) {
    return
  }
  currentIndex.value--
  if (currentIndex.value === -1) {
    setTimeout(() => {
      isMoving.value = true
      currentIndex.value = count.value - 1
      setTimeout(() => {
        isMoving.value = false
      }, 100)
    }, 250)
  }
}

function goNext() {
  if (count.value <= 1) {
    return
  }
  currentIndex.value++
  if (currentIndex.value === count.value) {
    setTimeout(() => {
      isMoving.value = true
      currentIndex.value = 0
      setTimeout(() => {
        isMoving.value = false
      }, 100)
    }, 250)
  }
}

function handleTouchEnd() {
  if (count.value <= 1) {
    return
  }
  isDragging.value = false
  const duration = Date.now() - start
  if (Math.abs(delta.value) / duration > 1000) {
    if (delta.value > 0) {
      goPrevious()
    } else {
      goNext()
    }
    return
  }

  if (Math.abs(delta.value) > width.value / 3) {
    if (delta.value > 0) {
      goPrevious()
    } else {
      goNext()
    }
  }

  isMoving.value = false
  originalX.value = 0
  currentX.value = 0
}
</script>
