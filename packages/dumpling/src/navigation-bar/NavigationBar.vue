<template>
  <div>
    <div
      :class="[
        'du-navigation-bar__wrapper',
        fixed && 'du-navigation-bar__wrapper--fixed',
      ]"
      :style="finalWrapperStyle"
    >
      <div class="du-navigation-bar">
        <div class="du-navigation-bar__left">
          <div v-if="back" class="du-navigation-bar__back" @click="handleBack">
            <DuIcon :name="icon" />
          </div>
          <slot name="left" />
          <div
            v-if="showContent"
            :class="[
              'du-navigation-bar__content',
              center && 'du-navigation-bar__content--center',
            ]"
          >
            <slot />
          </div>
        </div>
        <div class="du-navigation-bar__right">
          <slot name="right" />
          <button
            v-if="share"
            open-type="share"
            class="du-navigation-bar__share"
            @click="handleShare"
          >
            <DuIcon name="share-filled" />
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="fixed && placeholder"
      class="du-navigation-bar_wrapper"
      :style="wrapperStyle"
    >
      <div class="du-navigation-bar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CSSProperties,
  ref,
  onMounted,
  getCurrentInstance,
  computed,
} from 'vue'
import DuIcon from '../icon/Icon.vue'
import { setHeightByPage } from './helpers'
import { onPageScroll } from '@dcloudio/uni-app'

const props = withDefaults(
  defineProps<{
    /**
     * 颜色
     */
    color: string
    /**
     * 是否显示分享按钮
     */
    share: boolean
    /**
     * back
     */
    back: boolean
    /**
     * 返回按钮，在小程序平台不指定会根据页面所在层级自动判断
     */
    backIcon: string
    /**
     * 是否固定在顶部
     */
    fixed: boolean
    /**
     * 固定在顶部时候有一个占位
     */
    placeholder: boolean
    /**
     * 透明到显示的阈值，只有在 fixed 的时候有效，单位为 px？（没想好）
     */
    appearThreshold: number
    /**
     * 内容是否居中，目前需要自行保证内容不溢出
     */
    center: boolean
  }>(),
  {
    color: 'default',
    share: false,
    back: true,
    center: false,
  },
)

const emit = defineEmits<{
  (e: 'share'): void
}>()

const instance = getCurrentInstance()

onMounted(() => {
  if (__WEB__) {
    setHeightByPage(
      instance?.proxy?.$el
        .querySelector('.du-navigation-bar__wrapper')
        .getBoundingClientRect().height,
    )
  } else {
    setTimeout(() => {
      // @ts-ignore
      uni
        .createSelectorQuery()
        .in(instance?.proxy)
        .select('.du-navigation-bar__wrapper')
        .boundingClientRect((res: any) => {
          // @ts-ignore
          setHeightByPage(res.height, instance!.proxy!.$root.$scope)
        })
        .exec()
    }, 500)
  }
})

const icon = computed(() => {
  const arrowLeft = 'arrow-left'
  if (__UNI_PLATFORM__ !== 'h5') {
    const pages = getCurrentPages()
    if (pages?.length > 1) {
      return arrowLeft
    } else {
      return 'room'
    }
  }
  return props.backIcon || arrowLeft
})

const wrapperStyle = ref<CSSProperties>({
  '--du-c-navigation-bar-bg': `var(--du-c-${props.color}-navigation-bar-bg)`,
  '--du-c-navigation-bar-text': `var(--du-c-${props.color}-navigation-bar-text)`,
  '--du-c-navigation-bar-border': `var(--du-c-${props.color}-navigation-bar-border)`,
  width: '100%',
})

if (__UNI_PLATFORM__ !== 'h5') {
  // @ts-ignore
  const res = uni.getMenuButtonBoundingClientRect()
  // @ts-ignore
  const systemInfo = uni.getSystemInfoSync()

  const paddingRight = systemInfo.windowWidth - res.left
  const paddingTop = res.top - (44 - res.height) / 2

  wrapperStyle.value.paddingRight = paddingRight + 'px'
  wrapperStyle.value.paddingTop = paddingTop + 'px'
  wrapperStyle.value.width = `calc(100% - ${paddingRight}px)`
}

const scrollTop = ref(0)

if (__UNI_PLATFORM__ !== 'h5') {
  onPageScroll((params) => {
    scrollTop.value = params.scrollTop
  })
}
if (__WEB__) {
  window.addEventListener('scroll', () => {
    scrollTop.value = window.scrollY
  })
}

const showContent = computed(() => {
  if (props.fixed && props.appearThreshold > 0) {
    if (scrollTop.value > props.appearThreshold) {
      return true
    }
    return false
  }

  return true
})

const bgOpacity = computed(() => {
  if (props.fixed && props.appearThreshold > 0) {
    if (scrollTop.value > props.appearThreshold) {
      return '1'
    }
    return (scrollTop.value / props.appearThreshold).toFixed(4)
  }

  return '1'
})

const finalWrapperStyle = computed(() => {
  return {
    ...wrapperStyle.value,
    '--du-nav-bar-op': bgOpacity.value,
  }
})

function handleShare() {
  emit('share')
}

function handleBack() {
  if (__UNI_PLATFORM__ !== 'h5') {
    uni.navigateBack({
      fail() {
        // TODO: 先修复 BUG，全局支持配置这个
        uni.switchTab({
          url: '/pages-tab/home/index',
        })
      },
    })
  }
}
</script>
