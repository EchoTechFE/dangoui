<template>
  <div :class="className" :style="style">
    <img v-if="emptyImg" class="du-empty__img" :src="emptyImg" webp />
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
  networkError: `${PREFIX}/network.png`,
  offline: `${PREFIX}/network.png`,
  serviceError: `${PREFIX}/404.png`,
  loadError: `${PREFIX}/failed.png`,
  success: `${PREFIX}/success.png`,
  error: `${PREFIX}/failed.png`,
  empty: `${PREFIX}/empty.png`,
  searchEmpty: `${PREFIX}/empty.png`,
  contentDeleted: `${PREFIX}/deleted.png`,
  contentInvisible: `${PREFIX}/removed.png`,
  notFound: `${PREFIX}/empty.png`,
  verifying: `${PREFIX}/verify.png`,
  verifySucceeded: `${PREFIX}/success.png`,
  verifyFailed: `${PREFIX}/failed.png`,
}

const emptyImg = computed(() => {
  if (EMPTY_IMGS[props.image]) {
    return (
      EMPTY_IMGS[props.image] +
      `?x-oss-process=${encodeURIComponent(
        'image/auto-orient,1/resize,m_lfit,w_1080,h_1080/format,webp',
      )}`
    )
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
