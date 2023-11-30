<template>
  <!-- add minus 使用click.stop的原因是避免与FormItem组件一起使用时，点击事件冒泡导致DuInput触发聚焦频繁唤起键盘 -->
  <div class="du-input-number">
    <img
      class="du-input-number__item"
      :src="mValue > min ? ICONS.minus : ICONS.minusDisabled"
      alt="decrement"
      @click.stop="minus"
    />
    <div v-if="input" class="du-input-number__input">
      <DuInput
        :value="`${mValue}`"
        :prefix="inputPrefix"
        :suffix="inputSuffix"
        input-align="center"
        @input="onInput"
      />
    </div>

    <div v-else class="du-input-number__value">
      {{ mValue }}
    </div>

    <img
      class="du-input-number__item"
      :src="mValue < max ? ICONS.add : ICONS.addDisabled"
      alt="increment"
      @click.stop="add"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import DuInput from '../input/Input.vue'

const props = withDefaults(
  defineProps<{
    value: number
    min: number
    max: number
    input: boolean
    inputPrefix: string
    inputSuffix: string
    step: number
  }>(),
  {
    value: 0,
    min: 0,
    max: Infinity,
    input: false,
    inputPrefix: '',
    inputSuffix: '',
    step: 1,
  },
)

const emit = defineEmits<{
  (e: 'change', val: number): void
  (e: 'input', val: number): void
  (e: 'update:value', val: number): void
}>()

const ICONS = {
  minus:
    'https://cdn.qiandaoapp.com/admins/2cdeaab50e4e21960d680fe9243f5d4b.png',
  minusDisabled:
    'https://cdn.qiandaoapp.com/admins/7a42dab4cc6f6b6f6be4fc79f0287df1.png',
  add: 'https://cdn.qiandaoapp.com/admins/c8baffc5ffdc0c42f2e6120c31934867.png',
  addDisabled:
    'https://cdn.qiandaoapp.com/admins/65665d81f293a99bea9fafc600f0b32c.png',
}

const mValue = ref(props.value)

watch(
  () => props.value,
  (val) => {
    if (mValue.value !== val) {
      mValue.value = val
    }
  },
)

watch(mValue, (val) => {
  emit('input', val)
  emit('update:value', val)
  emit('change', val)
})

function minus() {
  const { step, min } = props
  const nVal = mValue.value - step
  if (nVal >= min) {
    mValue.value = nVal
  }
}

function add() {
  const { step, max } = props
  const nVal = mValue.value + step
  if (nVal <= max) {
    mValue.value = nVal
  }
}

function onInput(val: string) {
  mValue.value = Number(val)
}
</script>
