<template>
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
</template>

<script setup lang="ts">
import DuIcon from '../icon/Icon.vue'

defineProps<{
  share: boolean
}>()
</script>
