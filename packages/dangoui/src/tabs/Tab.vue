<template>
  <div
    v-if="type === 'default'"
    :id="id"
    :class="[
      'du-tab-item',
      {
        'du-tab-item--custom-active': !!indicatorConf && isActive,
        'du-tab-item--active': !indicatorConf && isActive,
        'du-tab-item--large': size === 'large',
      },
    ]"
    :style="style"
    @click="handleClick"
  >
    <slot />
  </div>
  <Tag
    v-else-if="type === 'tag'"
    :id="id"
    :size="size === 'large' ? 'medium' : 'normal'"
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
import { GlobalConfigKey } from '../plugins/globalConfig'

const props = defineProps<{
  name: string
}>()

const emit = defineEmits<{
  (e: 'click', event: any): void
}>()

const id = `du-tab-item-${getInstanceId()}`

const instance = getCurrentInstance()

const globalConfig = inject(GlobalConfigKey)
const tabsConfig = inject(TabsInjectionKey)

const indicatorConf = computed(() => {
  if (tabsConfig?.indicator.value && globalConfig?.tabs?.indicator) {
    const conf = globalConfig.tabs.indicator[tabsConfig.indicator.value]
    return conf
  }
})

const style = computed(() => {
  if (indicatorConf.value) {
    return {
      '--du-tabs-indicator-url': `url(${indicatorConf.value})`,
    }
  }
})

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

function handleClick(event: any) {
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

  emit('click', event)
}
</script>
