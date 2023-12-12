<template>
  <root-portal v-if="canUseRootPortal">
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
function isRootPortalAvailable(): boolean {
  // @ts-ignore
  if (typeof uni !== 'undefined') {
    // @ts-ignore
    return uni.canIUse('root-portal')
  } else {
    return false
  }
}

const isWeb = __WEB__

const canUseRootPortal = isRootPortalAvailable()
</script>
