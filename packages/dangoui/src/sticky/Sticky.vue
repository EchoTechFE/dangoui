<template>
  <div class="du-sticky" :style="style">
    <div class="du-sticky__content" :style="contentStyle">
      <slot :is-sticky="isFixed" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getCurrentInstance,
  onMounted,
  ref,
  computed,
  watch,
  onUnmounted,
} from 'vue'
import type { CSSProperties } from 'vue'
import { useNavigationBarHeight } from '../navigation-bar/helpers'
import { tryCall } from '../helpers'

const props = withDefaults(
  defineProps<{
    /**
     * 距离上方多少距离开始吸顶
     */
    top: number
    /**
     * z-index
     */
    z: number
    /**
     * 目前只实现了 viewport
     */
    relativeTo: 'viewport'
  }>(),
  {
    top: 0,
    z: 99,
    relativeTo: 'viewport',
  },
)

const instance = getCurrentInstance()
const height = ref(0)
const isFixed = ref(false)
const navbarHeight = useNavigationBarHeight(
  (instance!.proxy!.$root as any).$scope,
)

let observer: any

const style = computed(() => {
  const s: CSSProperties = {}
  if (isFixed.value) {
    s.height = height.value + 'px'
  }
  return s
})

const contentStyle = computed(() => {
  const s: CSSProperties = {}
  if (isFixed.value) {
    s.position = 'fixed'
    s.top = navbarHeight.value + props.top + 'px'
    s.width = '100%'
    s.zIndex = props.z
  }
  return s
})

watch(
  [
    () => props.top,
    () => props.relativeTo,
    () => navbarHeight.value,
    () => height.value,
  ],
  () => {
    if (!height.value) {
      return
    }
    initObserver()
  },
)

onMounted(() => {
  if (__UNI_PLATFORM__ !== 'h5') {
    tryCall(
      () => {
        return new Promise<void>((resolve, reject) => {
          uni
            .createSelectorQuery()
            .in(instance?.proxy)
            .select('.du-sticky__content')
            .boundingClientRect((res: any) => {
              if (!res) {
                reject(new Error('Retry'))
                return
              }
              if (res.top <= navbarHeight.value + props.top) {
                isFixed.value = true
              } else {
                isFixed.value = false
              }
              if (height.value === (res as UniApp.NodeInfo).height) {
                resolve()
                return
              }
              height.value = (res as UniApp.NodeInfo).height!
              initObserver()
              resolve()
            })
            .exec()
        })
      },
      {
        duration: 100,
        count: 5,
      },
    )
  }

  if (__WEB__) {
    const content = instance?.proxy?.$el.querySelector('.du-sticky__content')
    const rect = content.getBoundingClientRect()
    height.value = rect.height
    initObserver()
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

function initObserver() {
  if (observer) {
    observer.disconnect()
  }
  if (__UNI_PLATFORM__ !== 'h5') {
    // @ts-ignore
    observer = uni
      .createIntersectionObserver(instance?.proxy)
      .relativeToViewport({
        top: -navbarHeight.value - height.value - props.top,
      })

    observer.observe('.du-sticky', (res: any) => {
      if (res.boundingClientRect.top <= navbarHeight.value + props.top) {
        isFixed.value = true
      } else {
        isFixed.value = false
      }
    })
  }

  if (__WEB__) {
    observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].boundingClientRect.top <=
          navbarHeight.value + props.top
        ) {
          isFixed.value = true
        } else {
          isFixed.value = false
        }
      },
      {
        root: document,
        rootMargin: `-${
          props.top + height.value + navbarHeight.value
        }px 0px 0px 0px`,
      },
    )
    observer.observe(instance?.proxy?.$el)
  }
}

function scrollToSticky() {
  if (__UNI_PLATFORM__ !== 'h5') {
    // @ts-ignore
    const query = uni.createSelectorQuery().in(instance.proxy)
    // @ts-ignore
    query.selectViewport().scrollOffset()
    query.select('.du-sticky').boundingClientRect()
    query.exec((res: any) => {
      // @ts-ignore
      uni.pageScrollTo({
        scrollTop:
          res[0].scrollTop + res[1].top - navbarHeight.value - props.top,
      })
    })
  }

  // TODO: 未测试
  if (__WEB__) {
    const rect = instance?.proxy?.$el.getBoundingClientRect()
    window.scrollTo({
      top: window.scrollY + rect.top - navbarHeight.value - props.top,
      behavior: 'smooth',
    })
  }
}

defineExpose({
  scrollToSticky,
})
</script>
