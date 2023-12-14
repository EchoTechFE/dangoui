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
          <slot />
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
    <div v-if="fixed && placeholder" class="du-navigation-bar_wrapper">
      <div class="du-navigation-bar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CSSProperties, ref } from 'vue'
import DuIcon from '../icon/Icon.vue'

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
