<template>
  <div
    v-if="type === 'default'"
    :id="id"
    :class="[
      'du-tab',
      {
        'du-tab--active': isActive,
        'du-tab--large': size === 'large',
      },
    ]"
    @click="handleClick"
  >
    <slot />
  </div>
  <Tag
    v-else-if="type === 'tag'"
    :id="id"
    :size="size === 'large' ? 'medium' : 'small'"
    :color="isActive ? 'primary' : 'default'"
    @click="handleClick"
  >
    <slot />
  </Tag>
  <div
    v-else-if="type === 'text'"
    :id="id"
    :class="[
      'du-tab__text',
      {
        'du-tab__text--active': isActive,
        'du-tab__text--large': size === 'large',
      },
    ]"
    @click="handleClick"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { TabsInjectionKey } from './helpers'
import { getInstanceId } from './helpers'
import Tag from '../tag/Tag.vue'

const props = defineProps<{
  name: string
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const id = `du-tab-${getInstanceId()}`

const tabsConfig = inject(TabsInjectionKey)

const isActive = computed(() => {
  return tabsConfig?.value.value === props.name
})

const size = computed(() => {
  return tabsConfig?.size.value
})

const type = computed(() => {
  return tabsConfig?.type.value
})

function handleClick() {
  if (tabsConfig) {
    tabsConfig.setValue(props.name, id)
  }
  emit('click')
}
</script>
