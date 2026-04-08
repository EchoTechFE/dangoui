<template>
  <h3>{{ withPrefix ? `${component} 属性` : '属性' }}</h3>
  <OverlayScrollbarsComponent
    :options="{
      scrollbars: { autoHide: 'leave', autoHideDelay: 100 },
      overflow: { x: 'scroll', y: 'scroll' },
    }"
  >
    <table class="w-full">
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
            class="doc-attr-name"
          >
            <span class="doc-prop-color cursor-pointer">
              {{ kebabCase(prop.name) }}
            </span>
          </td>
          <td v-else class="doc-attr-name">{{ kebabCase(prop.name) }}</td>
          <td class="doc-attr-type">
            <code class="whitespace-break-spaces">{{ prop.type }}</code>
          </td>
          <td class="doc-attr-default">
            <span
              v-if="prop.default === 'unknown' || prop.default === 'undefined'"
            >
              -
            </span>
            <code v-else>{{ prop.default }}</code>
          </td>
          <td class="doc-attr-desc">{{ prop.description }}</td>
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
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th>名称</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="slot in doc.slots ?? []" :key="slot.name">
            <td class="doc-slot-name">{{ slot.name }}</td>
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
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th>名称</th>
            <th>类型</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="evt in doc.events ?? []" :key="evt.name">
            <td class="doc-event-name">{{ evt.name }}</td>
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

<style scoped>
h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--doc-text-primary);
  margin: var(--spacing-2xl) 0 var(--spacing-md);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--doc-border);
}

thead {
  background: var(--doc-bg-secondary);
}

thead th {
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: 600;
  color: var(--doc-text-secondary);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-right: 1px solid var(--doc-border);
}

thead th:last-child {
  border-right: none;
}

tbody tr {
  border-bottom: 1px solid var(--doc-border-light);
}

tbody tr:last-child {
  border-bottom: none;
}

tbody tr:hover {
  background: var(--doc-bg-secondary);
}

tbody td {
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--doc-text-primary);
  vertical-align: top;
  border-right: 1px solid var(--doc-border-light);
}

tbody td:last-child {
  border-right: none;
}

tbody td code {
  font-size: 12px;
  padding: 2px 6px;
  background: var(--doc-bg-secondary);
  border-radius: var(--radius-sm);
  color: var(--doc-accent);
  font-family: var(--doc-font-system);
}

.doc-attr-name {
  font-weight: 500;
  color: var(--doc-text-primary);
  font-size: 13px;
}

.doc-attr-type {
  font-size: 12px;
  color: var(--doc-text-secondary);
}

.doc-attr-default {
  font-size: 12px;
  color: var(--doc-text-tertiary);
}

.doc-attr-desc {
  font-size: 13px;
  color: var(--doc-text-secondary);
  line-height: 1.5;
}

.doc-slot-name {
  font-weight: 500;
  color: var(--doc-text-primary);
}

.doc-event-name {
  font-weight: 500;
  color: var(--doc-text-primary);
}
</style>
