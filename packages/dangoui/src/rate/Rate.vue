<template>
  <div :class="className" :style="style">
    <div :class="`du-rate du-rate__container du-rate__container--${size}`">
      <div
        v-for="index in chosen"
        :key="index"
        class="du-rate du-rate__item"
        @click="handleClickItem($event, index)"
        :style="{
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          animation: `${animation} 0.5s ease-in-out alternate`,
          animationDelay: `${index * 0.02}s`,
        }"
      >
        <DuIcon :name="icon" :size="iconSize" :color="color" />
        <div class="du-rate__item du-rate__text" :style="colorStyle" v-if="withText">
          {{ computedTextList[index - 1] }}
        </div>
      </div>
      <div
        v-if="percent > 0"
        @click="handleClickItem($event, Math.ceil(displayValue || 0))"
        :class="`du-rate du-rate__item du-rate__item--${size}`"
        :style="{
          cursor: disabled ? 'not-allowed' : 'pointer',
          animation: animation
            ? `${animation} 0.5s ease-in-out  alternate`
            : undefined,
        }"
      >
        <div class="du-rate du-rate__flex-row">
          <div
            :style="{
              width: percent * 100 + '%',
            }"
            class="du-rate du-rate__left-half"
          >
            <div class="du-rate__left-container">
              <DuIcon :name="icon" :size="iconSize" :color="color" />
              <div class="du-rate__item du-rate__text" :style="colorStyle" v-if="withText">
                {{ computedTextList[chosen] }}
              </div>
            </div>
          </div>

          <div
            class="du-rate du-rate__unselected"
          >
            <DuIcon :name="icon" :size="iconSize" color="#D4D0DA" />
            <div class="du-rate__item du-rate__text du-rate__text--unselected" v-if="withText">
              {{ computedTextList[chosen] }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-for="index in unchosen"
        :key="index"
        class="du-rate du-rate__item"
        @click="handleClickItem($event, Math.ceil(displayValue || 0) + index)"
        :style="{
          cursor: disabled ? 'not-allowed' : 'pointer',
        }"
      >
        <DuIcon :name="icon" :size="iconSize" color="#D4D0DA" />
        <div class="du-rate__item du-rate__text du-rate__text--unselected" v-if="withText">
          {{ computedTextList[percent > 0 ? chosen + index : chosen + index - 1] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, normalizeClass, normalizeStyle, ref, watch } from 'vue'
import DuIcon from '../icon/Icon.vue'
import { isPlatteColor } from '../helpers'

const props = withDefaults(
  defineProps<{
    /**
     * 总数
     */
    count: number
    /**
     * 默认值
     */
    defaultValue: number
    /**
     * 当前值
     */
    value: number
    /**
     * Rate 组件尺寸
     */
    size: 'large' | 'medium' | 'small' | 'mini'
    /**
     * 主题颜色
     */
    color: string
    /**
     * 是否禁用评分
     */
    disabled: boolean
    /**
     * 图标，对应 icon 组件的 name
     */
    icon: string

    extClass: string | string[] | Record<string, boolean>

    extStyle:
      | string
      | {
          [x: string]: string | number
        }
    /**
     * 评分改变时触发的过渡动画
     */
    animation: 'bounce' | 'fade' | null | undefined
    /**
     * 是否支持半选
     */
    half: boolean,
    /**
     * 是否在icon下显示文字
     */
    withText: boolean,
    /**
     * 文字列表
     */
    textList?: string[]
  }>(),
  {
    count: 5,
    value: undefined,
    size: 'medium',
    color: '#FC7E22',
    disabled: false,
    icon: 'rate-filled',
    extStyle: '',
    extClass: '',
    animation: null,
    half: false,
    defaultValue: 0,
    withText: false
  },
)

const emits = defineEmits<{
  (e: 'change', value: { value: number | undefined }): void
  (e: 'update:value', i: number): void
}>()

const displayValue = ref(props.defaultValue || props.value)

const computedTextList = computed(() => {
  if (props.withText && props.textList?.length === props.count) {
    return props.textList
  } else if (props.withText) {
    return Array.from({ length: props.count }).map((_, i) => String(i + 1))
  } else {
    return []
  }
})

const color = computed(() => {
  if (isPlatteColor(props.color)) {
    return `var(--du-${props.color}-color)`
  }
  return props.color
})

const colorStyle = computed(() => {
  return normalizeStyle({
    color: color.value,
  })
})

const chosen = computed(() => {
  return Math.floor(displayValue.value || 0)
})

// 小数点
const percent = computed(() => {
  return (displayValue.value || 0) - Math.floor(displayValue.value || 0)
})

const className = computed(() => {
  return normalizeClass(props.extClass)
})


const style = computed(() => {

  return normalizeStyle(props.extStyle)
})

const iconSize = computed(() => {
  switch (props.size) {
    case 'large':
      return 32
    case 'medium':
      return 12
    case 'small':
      return 8
    case 'mini':
      return 5
  }
})

watch(
  () => props.value,
  (newValue) => {
    if (newValue !== undefined) {
      displayValue.value = newValue
    }
  },
  { immediate: true },
)

const unchosen = computed(() => {
  return Math.floor(props.count) - Math.ceil(displayValue.value || 0)
})

function ifHalfSupported(e: any, i: number) {
  let position = 0
  let index = 0
  if (__UNI_PLATFORM__ !== 'h5') {
    const eleWidth = iconSize.value
    const halfWidth = eleWidth / 2
    const x = e.touches[0].clientX - e.currentTarget.offsetLeft
    position = x < halfWidth ? -1 : 1
  } else {
    const clickedElement = e.target
    const elementWidth = clickedElement.offsetWidth
    const clickX = e.clientX - clickedElement.getBoundingClientRect().left
    if (clickX < elementWidth / 2) {
      position = -1
    } else {
      position = 1
    }
  }

  if (position === -1) {
    index = i - 0.5
  } else {
    index = i
  }
  return index
}

function handleClickItem(e: Event, i: number) {
  if (props.disabled) return

  let index = i

  if (props.half) {
    index = ifHalfSupported(e, i)
  } else if (i > props.count) {
    index = props.count
  }

  if (props.value === undefined) {
    displayValue.value = index
    emits('update:value', props.value || 0)
  } else {
    emits('update:value', index || 0)
  }
  emits('change', { value: index })
}
</script>
