<template>
  <div>
    <div
      :class="[
        'du-navigation-bar__wrapper',
        fixed && 'du-navigation-bar__wrapper--fixed',
      ]"
      :style="wrapperStyle"
    >
      <div class="du-navigation-bar">
        <div class="du-navigation-bar__left">
          <div v-if="back" class="du-navigation-bar__back">
            <DuIcon name="arrow-left" />
          </div>
          <slot name="left" />
          <div class="du-navigation-bar__content">
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
import { CSSProperties, ref, onMounted, getCurrentInstance } from 'vue'
import DuIcon from '../icon/Icon.vue'
import { setHeightByPage } from './helpers'

const props = withDefaults(
  defineProps<{
    /**
     * 颜色
     */
    color: 'primary' | 'secondary' | 'default'
    /**
     * 是否显示分享按钮
     */
    share: boolean
    /**
     * back
     */
    back: boolean
    /**
     * 是否固定在顶部
     */
    fixed: boolean
    /**
     * 固定在顶部时候有一个占位
     */
    placeholder: boolean
  }>(),
  {
    color: 'default',
    share: false,
    back: true,
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

const wrapperStyle = ref<CSSProperties>({
  '--du-c-navigation-bar-bg': `var(--du-c-${props.color}-navigation-bar-bg)`,
  '--du-c-navigation-bar-text': `var(--du-c-${props.color}-navigation-bar-text)`,
  '--du-c-navigation-bar-border': `var(--du-c-${props.color}-navigation-bar-border)`,
  width: '100%',
})

// @ts-ignore
if (typeof uni !== 'undefined') {
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

function handleShare() {
  emit('share')
}
</script>
