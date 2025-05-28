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

withDefaults(
  defineProps<{
    disabled: boolean
  }>(),
  {
    disabled: true,
  },
)

const isWeb = __WEB__

const rootRef = ref<HTMLElement | null>(
  __UNI_PLATFORM__ === 'h5' ? null : __WEB__ ? document.body : null,
)

if (__UNI_PLATFORM__ === 'h5') {
  onMounted(() => {
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
