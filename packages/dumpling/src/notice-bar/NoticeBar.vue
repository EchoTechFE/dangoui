<template>
  <div class="du-notice-bar" :style="style">
    <div
      :class="[
        layout === 'horizontal' ? 'du-notice-bar__left' : 'du-notice-bar__v',
      ]"
    >
      <div class="du-notice-bar__text">
        <div class="du-notice-bar__text-inner">{{ text }}</div>
        <div
          v-if="layout === 'vertical' && closeable"
          class="du-notice-bar__v-close"
          @click="$emit('close')"
        >
          <DuIcon name="close-circle-filled" :size="12" />
        </div>
      </div>
      <DuDivider
        v-if="linkIcon || linkText"
        :type="layout === 'horizontal' ? 'vertical' : 'horizontal'"
        :length="layout === 'horizontal' ? 12 : '100%'"
      />
      <div
        v-if="linkIcon || linkText"
        class="du-notice-bar__link"
        @click="$emit('link-click')"
      >
        {{ linkText }}
        <DuIcon v-if="linkIcon" :name="linkIcon" />
      </div>
    </div>
    <div
      class="du-notice-bar__right"
      v-if="layout === 'horizontal' && closeable"
      @click="$emit('close')"
    >
      <DuIcon name="close-circle-filled" :size="12" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DuIcon from '../icon/Icon.vue'
import DuDivider from '../divider/Divider.vue'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * 颜色
     */
    color: 'primary' | 'success' | 'warning' | 'error'
    /**
     * 提示文案
     */
    text: string
    /**
     * 链接文案
     */
    linkText: string
    /**
     * 链接图标
     */
    linkIcon: string
    /**
     * 是否可关闭
     */
    closeable: boolean
    /**
     * 文案与链接的布局关系
     */
    layout: 'horizontal' | 'vertical'
  }>(),
  {
    color: 'primary',
    text: '',
    linkText: '',
    linkIcon: '',
    closeable: false,
    layout: 'horizontal',
  },
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'link-click'): void
}>()

const style = computed(() => {
  return {
    '--du-c-notice-bar': `var(--du-c-${props.color})`,
    '--du-c-notice-bar-bg': `var(--du-c-bg-${props.color})`,
  }
})
</script>
