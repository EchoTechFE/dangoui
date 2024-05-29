<template>
  <div :style="style" :class="className" v-if="show">
    <div class="du-snackbar__left">
      <DuIcon
        v-if="leftIcon"
        extClass="du-snackbar__left__icon"
        :name="leftIcon"
      />
      <DuImage
        v-if="leftImage"
        :src="leftImage"
        width="32px"
        height="32px"
        radius="4px"
        extClass="du-snackbar__left__image"
      />
    </div>
    <div class="du-snackbar__content"><slot /></div>
    <DuButton
      v-if="showActionBtn"
      :text="buttonProps?.text"
      :color="buttonProps?.color || 'white'"
      :type="buttonProps?.type || 'primary'"
      :size="buttonProps?.size || 'mini'"
      :extClass="buttonProps?.extClass"
      :extStyle="buttonProps?.extStyle"
      @click="emitAction"
      :style="{ flex: 'none' }"
    />
    <div v-if="showClose" class="du-snackbar__close">
      <DuIcon
        @click="emitClose"
        extClass="du-snackbar__close__icon"
        name="close-heavy"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, normalizeStyle, normalizeClass } from 'vue'
import DuButton from '../button/Button.vue'
import DuIcon from '../icon/Icon.vue'
import DuImage from '../image/Image.vue'

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
      color: string
      type: 'primary' | 'secondary' | 'outline' | 'text'
      size: 'normal' | 'mini' | 'small' | 'medium' | 'large'
      extClass: string | string[] | Record<string, boolean>
      extStyle:
        | string
        | {
            [x: string]: string | number
          }
    }
    showActionBtn: boolean
    leftIcon: string
    leftImage: string
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
    leftIcon: '',
    leftImage: '',
  },
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'action'): void
}>()

const className = computed(() => {
  const { extClass } = props
  return normalizeClass(['du-snackbar', extClass])
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
