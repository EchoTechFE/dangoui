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
  <teleport v-else to="body">
    <slot />
  </teleport>
  <!--  #endif -->
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    disabled: boolean
  }>(),
  {
    disabled: true,
  },
)

const isWeb = __WEB__

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
