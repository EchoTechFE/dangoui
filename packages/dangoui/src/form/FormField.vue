<template>
  <div
    :class="[
      'du-form-field',
      {
        'du-form-field--placeholder': !text,
      },
    ]"
    @click="handleClick"
  >
    <div>{{ text || placeholder }}</div>
    <div class="du-form-field__icon">
      <DuIcon :unsafe-internal="arrowHeavyRightIcon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DuIcon from '../icon/Icon.vue'
import { iconArrowHeavyRight } from 'dangoui-icon-config'

defineProps<{
  text: string
  placeholder: string
  arrowRight?: string
}>()

const emit = defineEmits<{
  (e: 'click', event: any): void
}>()

function handleClick(event: any) {
  emit('click', event)
}

const arrowHeavyRightIcon = (function () {
  if (__WEB__) {
    return iconArrowHeavyRight
  } else {
    return 'arrow-heavy-right'
  }
})()
</script>
