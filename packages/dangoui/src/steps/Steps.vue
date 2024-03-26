<template>
  <div class="du-steps" :style="style" :class="className">
    <div
      class="du-steps__step-wrapper"
      v-for="(step, idx) in fulfilledSteps"
      :key="step?.title"
      :style="{
        flex: idx === fulfilledSteps?.length - 1 ? 'none' : '1',
        justifyContent: 'flex-start',
      }"
    >
      <div class="du-steps__step">
        <div v-if="step?.type === 'before'" class="du-steps__before">
          <StepCheck :type="type === 'ghost' ? 'main' : 'default'" />
        </div>
        <div v-else-if="step.type === 'process'" class="du-steps__process">
          <div class="du-steps__process-inner" />
        </div>
        <div v-else-if="step.type === 'after'" class="du-steps__after" />
        <div :class="step?.textClassName">
          {{ step?.title }}
        </div>
        <div
          v-if="idx > 0"
          :class="[
            'du-steps__line du-steps__line--left',
            activeIndex > idx - 1 ? `du-steps__line--active` : '',
          ]"
        />
        <div
          v-if="idx < fulfilledSteps?.length - 1"
          :class="[
            'du-steps__line du-steps__line--right',
            activeIndex > idx ? `du-steps__line--active` : '',
          ]"
        />
      </div>
      <div
        :class="[
          'du-steps__ab-line du-steps__ab-line--right',
          activeIndex > idx ? `du-steps__ab-line--active` : '',
        ]"
        v-if="idx < fulfilledSteps?.length - 1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, normalizeStyle, normalizeClass } from 'vue'
import StepCheck from './StepCheck.vue'

const props = withDefaults(
  defineProps<{
    extClass: string | Array<string> | Record<string, boolean>
    extStyle:
      | string
      | {
          [x: string]: string | number
        }
    activeIndex: number
    /**
     * 当前进度的状态：进行中、已完成
     */
    status: 'process' | 'success'
    steps: Array<{
      title: string
    }>
    type: 'default' | 'ghost'
  }>(),
  {
    extClass: '',
    extStyle: '',
    activeIndex: 0,
    status: 'process',
    steps: () => [],
    type: 'default',
  },
)

const fulfilledSteps = computed(() => {
  // TODO: 简单实现，满足大部分场景，后面再改
  const maxLength = Math.max(...props.steps.map((item) => item.title.length))

  return props.steps.map((item, idx) => {
    let type = 'before'
    if (idx < props.activeIndex) {
      type = 'before'
    }
    if (idx === props.activeIndex) {
      type = props.status === 'process' ? 'process' : 'before'
    }
    if (idx > props.activeIndex) {
      type = 'after'
    }

    let title = item.title
    const extra = maxLength - item.title.length
    if (extra > 0) {
      title =
        Array(extra).fill('\xa0').join('') +
        title +
        Array(extra).fill('\xa0').join('')
    }

    return {
      ...item,
      title,
      type,
      textClassName: normalizeClass([
        'du-steps__text',
        `du-steps__text-${type}`,
      ]),
    }
  })
})

const style = computed(() => {
  const { extStyle } = props
  return normalizeStyle(extStyle)
})

const className = computed(() => {
  const { extClass } = props
  if (props.type === 'ghost') {
    return normalizeClass(['du-steps-theme-opacity', extClass])
  }
  return extClass
})
</script>
