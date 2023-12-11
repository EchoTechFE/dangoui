<template>
  <div class="du-navigation-bar__wrapper" :style="wrapperStyle">
    <div class="du-navigation-bar">
      <div class="du-navigation-bar__left">
        <div class="du-navigation-bar__back">
          <DuIcon name="arrow-left" />
        </div>
        <slot name="left" />
        <slot />
      </div>
      <div class="du-navigation-bar__right">
        <slot name="right" />
        <button v-if="share" class="du-navigation-bar__share">
          <DuIcon name="share-filled" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CSSProperties, ref } from 'vue'
import DuIcon from '../icon/Icon.vue'

defineProps<{
  share: boolean
}>()

const wrapperStyle = ref<CSSProperties>({})

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
}
</script>
