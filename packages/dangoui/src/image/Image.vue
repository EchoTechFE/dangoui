<template>
  <div :id="id" :class="className" :style="style">
    <img
      v-if="displaySrc"
      :src="displaySrc"
      :mode="mode"
      class="du-image__image"
      :style="imageStyle"
      :show-menu-by-longpress="showMenuByLongPress"
      webp
    />
  </div>
</template>

<script setup lang="ts">
import {
  watch,
  ref,
  computed,
  getCurrentInstance,
  inject,
  onMounted,
  onUnmounted,
  normalizeStyle,
  normalizeClass,
} from 'vue'
import { getInstanceId } from './helpers'
import { GlobalConfigKey } from '../plugins/globalConfig'

const props = withDefaults(
  defineProps<{
    /**
     * src
     */
    src: string
    /**
     * 缩放模式
     */
    mode: 'aspectFit' | 'aspectFill' | 'widthFix'
    /**
     * 宽度，如果能知道占据的宽度，最好设置，可以优化性能
     */
    width: number | string
    /**
     * 高度，如果能知道占据的高度，最好设置，可以优化性能
     */
    height: number | string
    /**
     * 圆角
     */
    radius?: number | string
    /**
     * showMenuByLongPress 微信小程序
     */
    showMenuByLongPress: boolean
    /**
     * 自定义 class
     */
    extClass?: string | string[] | Record<string, boolean>
    /**
     * 自定义 style
     */
    extStyle:
      | string
      | {
          [x: string]: string | number
        }
  }>(),
  {
    width: '100%',
    height: '100%',
    showMenuByLongPress: false,
    mode: 'aspectFill',
    extStyle: () => ({}),
    radius: undefined,
  },
)

const id = ref(`du-image-id-${getInstanceId()}`)

const instance = getCurrentInstance()

const globalConfig = inject(GlobalConfigKey, null)

const displaySrc = ref('')

const size = ref<{ width: number; height: number }>()

let observer: { disconnect: () => void } | undefined

onMounted(() => {
  if (typeof window !== 'undefined' && window.IntersectionObserver) {
    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const { width, height } = entries[0].boundingClientRect

        size.value = {
          width,
          height,
        }

        setDisplaySrc()
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
      .observe(`#${id.value}`, (res: any) => {
        const { width, height } = res.boundingClientRect

        size.value = {
          width,
          height,
        }

        setDisplaySrc()
      })
    observer = intersectionObserver
  } else {
    size.value = {
      width: 1080,
      height: 1080,
    }
    setDisplaySrc()
  }
})

onUnmounted(() => {
  observer?.disconnect()
})

function setDisplaySrc() {
  const provider = globalConfig?.image?.providers?.find((provider) => {
    return provider.test.test(props.src)
  })

  if (provider) {
    const src = provider.getImage(props.src, {
      modifiers: {
        width: size.value?.width ?? 1080,
        height: size.value?.height ?? 1080,
        dpr: 2,
      },
    })
    displaySrc.value = src.url
  } else {
    displaySrc.value = props.src
  }

  if (observer) {
    observer.disconnect()
    observer = undefined
  }
}

watch(
  () => props.src,
  () => {
    if (size.value) {
      setDisplaySrc()
    }
  },
)

const className = computed(() => {
  return normalizeClass(['du-image', props.extClass])
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

  return normalizeStyle([
    { width: props.width, height: props.height, borderRadius: props.radius },
    extStyle,
  ])
})
</script>
