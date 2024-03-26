<template>
  <div
    :id="id"
    :class="[
      'du-tabs',
      {
        'du-tabs--default-large': size === 'large' && type === 'default',
        'du-tabs--default': size === 'normal' && type === 'default',
      },
    ]"
    :style="{
      '--du-tabs-active-color': `var(--du-${color}-color)`,
    }"
  >
    <div class="du-tabs__left">
      <slot name="left" />
    </div>
    <scroll-view
      class="du-tabs__content-wrapper"
      scroll-with-animation
      scroll-x
      :scroll-left="scrollViewLeft"
    >
      <div class="du-tabs__list">
        <div class="du-tabs__padding" />
        <div :class="['du-tabs__content', `du-tabs__content--${type}-${size}`]">
          <slot />
        </div>
        <div class="du-tabs__padding" />
      </div>
    </scroll-view>
    <div
      :class="[
        'du-tabs__right-wrapper',
        `du-tabs__right-wrapper--${type}-${size}`,
        {
          'du-tabs__right-wrapper--more': hasRight,
        },
      ]"
    >
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  provide,
  toRef,
  ref,
  onMounted,
  getCurrentInstance,
} from 'vue'
import { TabConfigOpt, TabsInjectionKey, getInstanceId } from './helpers'
import { dividerInjectionKey } from '../divider/helpers'

const props = withDefaults(
  defineProps<{
    /**
     * 色彩，可以使用色板中的颜色名
     */
    color: string
    type: 'default' | 'tag' | 'text'
    value: string
    size: 'normal' | 'large'
  }>(),
  {
    color: 'primary',
    size: 'normal',
    type: 'default',
  },
)

const emit = defineEmits<{
  (e: 'update:value', name: string): void
}>()

const id = `du-tabs-${getInstanceId()}`

const readonlyValue = computed(() => props.value)

const hasRight = ref(false)

const scrollViewLeft = ref(0)

const instance = getCurrentInstance()

onMounted(() => {
  if (__WEB__) {
    const rightWrapperRect = document
      .querySelector(`#${id} .du-tabs__right-wrapper`)
      ?.getBoundingClientRect()
    if (rightWrapperRect?.width && rightWrapperRect.width < 1) {
      hasRight.value = false
    } else {
      hasRight.value = true
    }
  }
})

// @ts-ignore
const isScrollToEnd = computed(() => {
  return true
})

function setValue(name: string) {
  emit('update:value', name)
}

function updateLayout(name: string, tabId: string, opts?: TabConfigOpt) {
  if (name !== props.value) {
    return
  }

  if (__WEB__) {
    const tabsEl = document.getElementById(id)
    if (tabsEl) {
      const scrollView = tabsEl.querySelector('.du-tabs__content-wrapper')
      const tabEl = tabsEl.querySelector('#' + tabId)
      const scrollViewRect = scrollView!.getBoundingClientRect()
      const tabElRect = tabEl!.getBoundingClientRect()

      let scrollLeft =
        scrollView!.scrollLeft +
        tabElRect.x +
        tabElRect.width / 2 -
        (scrollViewRect.x + scrollViewRect.width / 2)

      if (scrollLeft < 0) {
        scrollLeft = 0
      }

      scrollViewLeft.value = scrollLeft
    }
  }

  if (__UNI_PLATFORM__ !== 'h5' && opts?.rect) {
    const rect = opts.rect
    // @ts-ignore
    const query = uni.createSelectorQuery().in(instance?.proxy)
    const scrollViewClass = '.du-tabs__content-wrapper'
    query.select(scrollViewClass).boundingClientRect()
    // @ts-ignore
    query.select(scrollViewClass).scrollOffset()
    query.exec((res: any) => {
      // 异步，可能值已经发生改变
      if (name !== props.value) {
        return
      }
      let scrollLeft =
        res[1].scrollLeft +
        rect.left +
        rect.width / 2 -
        (res[0].left + res[0].width / 2)
      if (scrollLeft < 0) {
        scrollLeft = 0
      }
      scrollViewLeft.value = scrollLeft
    })
  }
}

provide(TabsInjectionKey, {
  size: toRef(props, 'size'),
  type: toRef(props, 'type'),
  value: readonlyValue,
  color: toRef(props, 'color'),
  setValue,
  updateLayout,
})

provide(dividerInjectionKey, {
  defaultType: 'vertical',
  length: ref(12),
})
</script>
