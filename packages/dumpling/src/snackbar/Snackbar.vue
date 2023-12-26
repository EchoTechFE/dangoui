<template>
  <div :style="style" :class="className" v-if="show">
    <div v-if="showClose" class="du-snackbar__close">
      <DuIcon
        @click="emitClose"
        extClass="du-snackbar__close__icon"
        :name="leftIcon"
      />
      <div class="du-snackbar__close__bgc"></div>
    </div>
    <div class="du-snackbar__content">
      <slot />
    </div>
    <DuButton
      v-if="showActionBtn"
      size="mini"
      color="white"
      :text="buttonProps?.text"
      @click="emitAction"
      :style="{ flex: 'none' }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, normalizeStyle } from 'vue'
import classNames from 'classnames'
import DuButton from '../button/Button.vue'
import DuIcon from '../icon/Icon.vue'

const props = withDefaults(
  defineProps<{
    extClass: string | string[] | Record<string, boolean>
    extStyle:
      | string
      | {
          [x: string]: string | number
        }
    offset: number
    offsetPosition: 'top' | 'bottom'
    duration: number
    show: boolean
    showClose: boolean
    buttonProps?: {
      text: string
    }
    showActionBtn: boolean
    leftIcon: string
  }>(),
  {
    extClass: '',
    extStyle: '',
    offset: 0,
    offsetPosition: 'bottom',
    duration: 0,
    show: true,
    showClose: false,
    buttonProps: undefined,
    showActionBtn: true,
    leftIcon: 'close-circle-filled',
  },
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'action'): void
}>()

const className = computed(() => {
  const { extClass } = props
  return classNames('du-snackbar', extClass)
})
const style = computed(() => {
  const { extStyle, offset, offsetPosition } = props
  const vw = offset / 7.5
  const defaultStyle =
    offset > 0
      ? {
          position: 'fixed',
          left: 0,
          right: 0,
          [offsetPosition]: `${vw}vw`,
        }
      : {}

  return normalizeStyle([defaultStyle, extStyle])
})

const emitClose = () => emit('close')

const emitAction = () => emit('action')

watch(
  () => props.show,
  (show) => {
    const { duration } = props
    if (show && duration > 0) {
      setTimeout(emitClose, duration * 1000)
    }
  },
  {
    immediate: true,
  },
)
</script>
