<template>
  <h3>{{ withPrefix ? `${component} 属性` : '属性' }}</h3>
  <OverlayScrollbarsComponent
    :options="{
      scrollbars: { autoHide: 'leave', autoHideDelay: 100 },
      overflow: { x: 'scroll', y: 'scroll' },
    }"
  >
    <table class="w-full !table">
      <thead>
        <tr class="text-left">
          <th>属性名</th>
          <th>类型</th>
          <th>默认值</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prop in doc.props ?? []" :key="prop.name">
          <td
            v-if="prop.name === 'color'"
            class="c-qd-purple underline underline-dashed underline-qd-purple"
          >
            <span class="doc-prop-color cursor-pointer">
              {{ kebabCase(prop.name) }}
            </span>
          </td>
          <td v-else>{{ kebabCase(prop.name) }}</td>
          <td>
            <code class="whitespace-break-spaces">{{ prop.type }}</code>
          </td>
          <td>
            <span
              v-if="prop.default === 'unknown' || prop.default === 'undefined'"
            >
              -
            </span>
            <code v-else>{{ prop.default }}</code>
          </td>
          <td>{{ prop.description }}</td>
        </tr>
      </tbody>
    </table>
  </OverlayScrollbarsComponent>
  <template v-if="doc.slots && doc.slots.length > 0">
    <h3>{{ withPrefix ? `${component} 插槽` : '插槽' }}</h3>
    <OverlayScrollbarsComponent
      :options="{
        scrollbars: { autoHide: 'leave', autoHideDelay: 100 },
        overflow: { x: 'scroll', y: 'scroll' },
      }"
    >
      <table class="w-full !table">
        <thead>
          <tr class="text-left">
            <th>名称</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="slot in doc.slots ?? []" :key="slot.name">
            <td>{{ slot.name }}</td>
          </tr>
        </tbody>
      </table>
    </OverlayScrollbarsComponent>
  </template>
  <template v-if="doc.events && doc.events.length > 0">
    <h3>{{ withPrefix ? `${component} 事件` : '事件' }}</h3>
    <OverlayScrollbarsComponent
      :options="{
        scrollbars: { autoHide: 'leave', autoHideDelay: 100 },
        overflow: { x: 'scroll', y: 'scroll' },
      }"
    >
      <table class="w-full !table">
        <thead>
          <tr class="text-left">
            <th>名称</th>
            <th>类型</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="evt in doc.events ?? []" :key="evt.name">
            <td>{{ evt.name }}</td>
            <td>
              <code>{{ evt.signature }}</code>
            </td>
          </tr>
        </tbody>
      </table>
    </OverlayScrollbarsComponent>
  </template>
</template>

<script setup lang="ts">
import componentMeta from '@/assets/component-meta/meta.json'
import { kebabCase } from 'lodash-es'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import tippy from 'tippy.js'

const props = defineProps<{
  component: string
  withPrefix?: boolean
}>()

const doc = computed(() => {
  return componentMeta[props.component as keyof typeof componentMeta]
})

onMounted(() => {
  tippy('.doc-prop-color', {
    content:
      "<code>'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'trade' | 'white' | 'vip'</code>",
    allowHTML: true,
  })
})
</script>
