<template>
  <div class="du-search" :style="style" @click="handleClick">
    <slot name="left">
      <DuIcon name="search" />
    </slot>
    <input
      class="du-search__input"
      :value="value"
      @input="handleInput"
      :placeholder="placeholder"
    />
    <DuIcon
      v-if="value && clearable"
      name="close-circle-filled"
      class="du-search__close"
      @click="handleClear"
    />
    <div class="du-search__right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DuIcon from '../icon/Icon.vue'
import { dividerInjectionKey } from '../divider/helpers'
import { computed, provide } from 'vue'

const props = withDefaults(
  defineProps<{
    placeholder: string
    value: string
    clearable: boolean
    bg: string
  }>(),
  {
    placeholder: '',
    value: '',
    clearable: false,
    bg: '',
  },
)

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'update:value', value: string): void
}>()

provide(dividerInjectionKey, {
  defaultType: 'vertical',
})

const style = computed(() => {
  if (props.bg) {
    return {
      backgroundColor: props.bg,
    }
  }
  return {}
})

function handleInput(e: any) {
  emit('update:value', e.target.value)
}

function handleClear() {
  emit('update:value', '')
}

function handleClick() {
  emit('click')
}
</script>
