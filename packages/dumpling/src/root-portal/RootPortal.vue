<template>
  <root-portal v-if="canUseRootPortal">
    <slot />
  </root-portal>
  <teleport v-else to="body">
    <slot />
  </teleport>
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

const canUseRootPortal = isRootPortalAvailable()
</script>
