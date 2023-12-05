<template>
  <div :id="id" :class="className" :style="style">
    <img
      v-if="displaySrc"
      :src="displaySrc"
      :mode="mode"
      class="du-image__image"
      :style="imageStyle"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  getCurrentInstance,
  inject,
  onMounted,
  onUnmounted,
} from 'vue'
import classNames from 'classnames'
import styleToCss from 'style-object-to-css-string'
import { getInstanceId } from './helpers'
import { GlobalConfigKey } from '../plugins/globalConfig'

const props = withDefaults(
  defineProps<{
    /**
     * src
     */
    src: string
    /**
     * 自定义 class
     */
    extClass?: string | string[] | Record<string, boolean>
    /**
     * 自定义 style
     */
    extStyle: Record<string, string | number>
    mode: 'aspectFit' | 'aspectFill' | 'widthFix'
    width: number | string
    height: number | string
  }>(),
  {
    width: '100%',
    height: '100%',
    mode: 'aspectFill',
    extStyle: () => ({}),
  },
)

const id = ref(`du-image-id-${getInstanceId()}`)

const instance = getCurrentInstance()

const globalConfig = inject(GlobalConfigKey)

const displaySrc = ref('')

let observer: { disconnect: () => void } | undefined

onMounted(() => {
  if (typeof window !== 'undefined' && window.IntersectionObserver) {
    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const { width, height } = entries[0].boundingClientRect

        const provider = globalConfig?.image?.providers?.find((provider) => {
          return provider.test.test(props.src)
        })

        if (provider) {
          const src = provider.getImage(props.src, {
            modifiers: {
              width,
              height,
              dpr: 2,
            },
          })
          displaySrc.value = src.url
        } else {
          displaySrc.value = props.src
        }

        intersectionObserver.disconnect()
        observer = undefined
      }
    })
    intersectionObserver.observe(document.getElementById(id.value)!)
    observer = intersectionObserver
  } else if (
    instance?.proxy &&
    (instance.proxy as any).createIntersectionObserver
  ) {
    const intersectionObserver = (
      instance.proxy as any
    ).createIntersectionObserver()
    intersectionObserver
      .relativeToViewport({ bottom: 150 })
      .observer(`#${id}`, (res: any) => {
        const { width, height } = res.boundingClientRect

        const provider = globalConfig?.image?.providers?.find((provider) => {
          return provider.test.test(props.src)
        })

        if (provider) {
          const src = provider.getImage(props.src, {
            modifiers: {
              width,
              height,
              // TODO:
              dpr: 2,
            },
          })
          displaySrc.value = src.url
        } else {
          displaySrc.value = props.src
        }

        intersectionObserver.disconnect()
        observer = undefined
      })
    observer = intersectionObserver
  }
})

onUnmounted(() => {
  observer?.disconnect()
})

const className = computed(() => {
  return classNames(['du-image'], props.extClass)
})

const imageStyle = computed(() => {
  // @ts-ignore
  if (typeof uni === 'undefined') {
    switch (props.mode) {
      case 'aspectFit':
        return {
          objectFit: 'contain' as const,
        }
      case 'aspectFill':
        return {
          objectFit: 'cover' as const,
        }
      default:
        return {}
    }
  }
  return {}
})

const style = computed(() => {
  const { extStyle } = props

  return typeof extStyle === 'string'
    ? extStyle
    : styleToCss({
        width: props.width,
        height: props.height,
        ...extStyle,
      })
})
</script>
