<template>
  <div v-if="loading" :class="classes" :style="style">
    <div class="du-skeleton__content">
      <slot name="template">
        <template v-for="config in configs" :key="`skeleton-${config.type}`">
          <DuSkeletonParagraph
            v-if="config.type === 'paragraph'"
            :row-width="config.rowWidth"
            :row-height="config.rowHeight"
            :gap="config.gap"
          />
          <DuSkeletonAvatar
            v-else-if="config.type === 'avatar'"
            :size="config.size"
          />
          <DuSkeletonRectangle
            v-else-if="config.type === 'rectangle'"
            :aspect-ratio="config.aspectRatio"
            :width="config.width"
          />
        </template>
      </slot>
    </div>
  </div>
  <slot v-else></slot>
</template>

<script setup lang="ts">
import { computed, normalizeStyle, normalizeClass } from 'vue'
import DuSkeletonParagraph from './SkeletonParagraph.vue'
import DuSkeletonAvatar from './SkeletonAvatar.vue'
import DuSkeletonRectangle from './SkeletonRectangle.vue'

type SkeletonConfig = {
  type: 'paragraph' | 'avatar' | 'rectangle'
  rowWidth?: string
  rowHeight?: number | string
  aspectRatio?: number
  gap?: number | string
  size?: number | string
  width?: number | string
}

const props = withDefaults(
  defineProps<{
    extClass: string | string[] | Record<string, boolean>
    extStyle:
      | string
      | {
          [x: string]: string | number
        }
    animate: boolean
    loading: boolean
    configs: SkeletonConfig[]
  }>(),
  {
    extClass: '',
    extStyle: () => ({}),
    animate: true,
    loading: true,
  },
)

const classes = normalizeClass(['du-skeleton', props.extClass])
const style = computed(() => {
  const { extStyle } = props
  return normalizeStyle([extStyle])
})
</script>
