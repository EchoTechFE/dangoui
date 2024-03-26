<template>
  <div
    v-if="type === 'default'"
    :id="id"
    :class="[
      'du-tab-item',
      {
        'du-tab-item--active': isActive,
        'du-tab-item--large': size === 'large',
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
    :color="isActive ? color : 'default'"
    @click="handleClick"
  >
    <slot />
  </Tag>
  <div
    v-else-if="type === 'text'"
    :id="id"
    :class="[
      'du-tab-item__text',
      {
        'du-tab-item__text--active': isActive,
        'du-tab-item__text--large': size === 'large',
      },
    ]"
    @click="handleClick"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, getCurrentInstance } from 'vue'
import { TabConfigOpt, TabsInjectionKey } from './helpers'
import { getInstanceId } from './helpers'
import Tag from '../tag/Tag.vue'

const props = defineProps<{
  name: string
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const id = `du-tab-item-${getInstanceId()}`

const instance = getCurrentInstance()

const tabsConfig = inject(TabsInjectionKey)

const isActive = computed(() => {
  return tabsConfig?.value.value === props.name
})

const color = computed(() => {
  return tabsConfig?.color.value ?? 'primary'
})

const size = computed(() => {
  return tabsConfig?.size.value
})

const type = computed(() => {
  return tabsConfig?.type.value
})

function handleClick() {
  if (tabsConfig) {
    const opt: TabConfigOpt = {}
    if (__WEB__) {
      setTimeout(() => {
        tabsConfig.updateLayout(props.name, id)
      }, 0)
    }

    if (__UNI_PLATFORM__ !== 'h5') {
      // @ts-ignore
      const query = uni.createSelectorQuery().in(instance?.proxy)
      query.select('#' + id).boundingClientRect((res: any) => {
        opt.rect = res
        tabsConfig.updateLayout(props.name, id, opt)
      })
      query.exec()
    }

    tabsConfig.setValue(props.name, id)
  }

  emit('click')
}
</script>
