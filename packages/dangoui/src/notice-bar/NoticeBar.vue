<template>
  <div class="du-notice-bar" :style="style">
    <div
      :class="[
        layout === 'horizontal' ? 'du-notice-bar__left' : 'du-notice-bar__v',
      ]"
    >
      <div class="du-notice-bar__text" v-if="text">
        <div class="du-notice-bar__text-inner">
          <div class="du-notice-bar__left-icon" v-if="icon">
            <DuIcon :unsafe-internal="icon" :size="12" />
          </div>
          <div :class="[ellipsis && 'du-notice-bar__text-content']">
            {{ text }}
          </div>
        </div>
        <div
          v-if="layout === 'vertical' && closeable"
          class="du-notice-bar__v-close"
          @click="$emit('close')"
        >
          <DuIcon :unsafe-internal="closeCircleFilledIcon" :size="12" />
        </div>
      </div>
      <DuDivider
        v-if="text && (linkIcon || linkText)"
        :type="layout === 'horizontal' ? 'vertical' : 'horizontal'"
        :length="layout === 'horizontal' ? 8 : '100%'"
        :color="dividerColor"
      />
      <div
        v-if="linkIcon || linkText"
        class="du-notice-bar__link"
        @click="$emit('link-click')"
      >
        {{ linkText }}
        <DuIcon v-if="linkIcon" :unsafe-internal="linkIcon" />
      </div>
    </div>
    <div
      class="du-notice-bar__right"
      v-if="layout === 'horizontal' && closeable"
      @click="$emit('close')"
    >
      <DuIcon :unsafe-internal="closeCircleFilledIcon" :size="12" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DuIcon from '../icon/Icon.vue'
import DuDivider from '../divider/Divider.vue'
import { computed } from 'vue'
import { iconCloseCircleFilled } from 'dangoui-icon-config'

const props = withDefaults(
  defineProps<{
    /**
     * 类型
     */
    type: 'primary' | 'secondary'
    /**
     * 左边的按钮
     */
    icon?: string
    /**
     * 色彩，可以使用色板中的颜色名
     */
    color: string
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
    linkIcon: string | { _: string }
    /**
     * 是否可关闭
     */
    closeable: boolean
    /**
     * 文案与链接的布局关系
     */
    layout: 'horizontal' | 'vertical'
    /**
     * 超长是否截断显示省略号
     */
    ellipsis: boolean
  }>(),
  {
    type: 'secondary',
    color: 'primary',
    text: '',
    linkText: '',
    linkIcon: '',
    closeable: false,
    layout: 'horizontal',
    ellipsis: false,
  },
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'link-click'): void
}>()

const style = computed(() => {
  if (props.type === 'primary') {
    return {
      '--du-c-notice-bar': `var(--du-${props.color}-solid-color)`,
      '--du-c-notice-bar-bg': `var(--du-${props.color}-solid-bg)`,
    }
  }
  return {
    '--du-c-notice-bar': `var(--du-${props.color}-color)`,
    '--du-c-notice-bar-bg': `var(--du-${props.color}-soft-bg)`,
  }
})

const closeCircleFilledIcon = (function () {
  if (__WEB__) {
    return iconCloseCircleFilled
  } else {
    return 'close-circle-filled'
  }
})()

const dividerColor = computed(() => {
  if (props.type === 'primary') {
    return `${props.color}-solid-color`
  }
  return `${props.color}-color`
})
</script>
