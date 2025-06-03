<template>
  <div v-if="disabled">
    <slot />
  </div>
  <root-portal v-else-if="canUseRootPortal">
    <slot />
  </root-portal>
  <div v-else-if="!isWeb">
    <slot />
  </div>
  <!--  #ifdef H5 -->
  <teleport v-else-if="rootRef" :to="rootRef">
    <slot />
  </teleport>
  <!--  #endif -->
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    disabled: boolean
    root: 'app' | 'page'
  }>(),
  {
    disabled: true,
    root: 'page',
  },
)

const isWeb = __WEB__

function getDefaultRoot() {
  if (__WEB__) {
    if (typeof uni === 'undefined') {
      return 'body'
    } else {
      if (props.root === 'app') {
        return 'body'
      } else {
        return null
      }
    }
  } else {
    return null
  }
}

const rootRef = ref<HTMLElement | string | null>(getDefaultRoot())

if (__WEB__) {
  onMounted(() => {
    if (rootRef.value) {
      return
    }

    const instance = getCurrentInstance()

    const el = instance?.proxy?.$el?.parentElement

    if (el) {
      const root = el.closest('uni-page')

      if (root) {
        rootRef.value = root
      }
    }
  })
}

function isRootPortalAvailable(): boolean {
  if (isWeb) {
    return false
  }

  // @ts-ignore
  if (typeof uni !== 'undefined') {
    // @ts-ignore
    return uni.canIUse('root-portal')
  } else {
    return false
  }
}

const canUseRootPortal = isRootPortalAvailable()
</script>
