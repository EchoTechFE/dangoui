<template>
  <div class="du-tags-panel">
    <DuButton size="small" type="outline" @click="$emit('add')">添加</DuButton>
    <DuTag
      size="medium"
      closeable
      v-for="tag in displayTags"
      :key="tag.value"
      @close="$emit('remove', { value: tag.value })"
    >
      {{ tag.text }}
    </DuTag>
    <DuButton
      v-if="!isExpanded && tags.length > 10"
      size="small"
      type="text"
      color="secondary"
      icon="arrow-down-circle"
      icon-position="right"
      @click="handleExpand"
    >
      展开 {{ tags.length }}
    </DuButton>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import DuTag from '../tag/Tag.vue'
import DuButton from '../button/Button.vue'

const props = withDefaults(
  defineProps<{
    tags: { text: string; value: string | number }[]
  }>(),
  {
    tags: () => [],
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
  return props.tags.slice(0, 10)
})

const isExpanded = ref(false)

function handleExpand() {
  isExpanded.value = true
}
</script>
