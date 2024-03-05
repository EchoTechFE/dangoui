<template>
  <div :class="className" :style="style">
    <img v-if="emptyImg" class="du-empty__img" :src="emptyImg" />
    <div class="du-empty__text">{{ text }}</div>
    <DuButton
      v-if="buttonText"
      type="secondary"
      @click="handleBtnClick"
      :ext-style="buttonStyle"
    >
      {{ buttonText }}
    </DuButton>
  </div>
</template>

<script setup lang="ts">
import { computed, normalizeStyle, normalizeClass } from 'vue'
import DuButton from '../button/Button.vue'

const props = withDefaults(
  defineProps<{
    image: string
    text: string
    buttonText: string
    extClass: string | string[] | Record<string, boolean>
    extStyle:
      | string
      | {
          [x: string]: string | number
        }
  }>(),
  {
    image: 'empty',
    text: '',
    buttonText: '',
    extClass: '',
    extStyle: '',
  },
)

const emit = defineEmits<{
  (e: 'buttonClick'): void
}>()

const PREFIX = 'https://assets.qiandaocdn.com/dumpling/v3/assets'

const EMPTY_IMGS: Record<string, string> = {
  networkError: `${PREFIX}/network.svg`,
  offline: `${PREFIX}/network.svg`,
  serviceError: `${PREFIX}/404.svg`,
  loadError: `${PREFIX}/failed.svg`,
  success: `${PREFIX}/success.svg`,
  error: `${PREFIX}/failed.svg`,
  empty: `${PREFIX}/empty.svg`,
  searchEmpty: `${PREFIX}/empty.svg`,
  contentDeleted: `${PREFIX}/deleted.svg`,
  contentInvisible: `${PREFIX}/removed.svg`,
  notFound: `${PREFIX}/empty.svg`,
  verifying: `${PREFIX}/verify.svg`,
  verifySucceeded: `${PREFIX}/success.svg`,
  verifyFailed: `${PREFIX}/failed.svg`,
}

const emptyImg = computed(() => {
  if (EMPTY_IMGS[props.image]) {
    return EMPTY_IMGS[props.image]
  }

  return props.image
})

const buttonStyle = computed(() => {
  return normalizeStyle({
    marginTop: Math.floor((12 / 375) * 100) + 'vw',
  })
})

const handleBtnClick = () => {
  emit('buttonClick')
}

const style = computed(() => {
  const { extStyle } = props

  return normalizeStyle(extStyle)
})

const className = computed(() => {
  return normalizeClass(['du-empty', props.extClass])
})
</script>
