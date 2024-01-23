<template>
  <div class="du-tags-panel">
    <slot name="add">
      <DuButton size="small" type="outline" @click="$emit('add')">
        {{ addText }}
      </DuButton>
    </slot>
    <DuTag
      size="medium"
      v-for="tag in displayTags"
      :closeable="'canRemove' in tag ? tag.canRemove : true"
      :key="tag.value"
      @close="$emit('remove', { value: tag.value })"
    >
      {{ tag.text }}
    </DuTag>
    <DuButton
      v-if="(!isExpanded || canToggle) && tags.length > collapseCount"
      size="small"
      type="text"
      color="secondary"
      :icon="isExpanded ? 'arrow-up-circle' : 'arrow-down-circle'"
      icon-position="right"
      @click="handleExpand"
    >
      {{ toggleText }} {{ tags.length }}
    </DuButton>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import DuTag from '../tag/Tag.vue'
import DuButton from '../button/Button.vue'

const props = withDefaults(
  defineProps<{
    /**
     * 添加按钮文案
     */
    addText: string
    /**
     * 标签，value 是唯一标识符，没有 canRemove 字段的话默认可以删除
     */
    tags: { text: string; value: string | number; canRemove?: boolean }[]
    /**
     * 可以收起
     */
    canToggle: boolean
    /**
     * 多少个的时候显示展开按钮
     */
    collapseCount: number
  }>(),
  {
    addText: '添加',
    tags: () => [],
    canToggle: false,
    collapseCount: 10,
  },
)

defineEmits<{
  (evt: 'add'): void
  (evt: 'remove', payload: { value: string | number }): void
}>()

const displayTags = computed(() => {
  if (isExpanded.value) {
    return props.tags
  }

  return props.tags.slice(0, props.collapseCount)
})

const isExpanded = ref(false)

const toggleText = computed(() => {
  return isExpanded.value ? '收起' : '展开'
})

function handleExpand() {
  isExpanded.value = !isExpanded.value
}
</script>
