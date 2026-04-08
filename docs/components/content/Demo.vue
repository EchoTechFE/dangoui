<template>
  <section class="demo-block">
    <div class="demo-block-header">
      <span class="demo-block-title">{{ title }}</span>
      <div class="demo-block-tabs">
        <button
          :class="['demo-tab', { 'demo-tab--active': activeTab === 'preview' }]"
          @click="activeTab = 'preview'"
        >预览</button>
        <button
          :class="['demo-tab', { 'demo-tab--active': activeTab === 'code' }]"
          @click="activeTab = 'code'"
        >代码</button>
      </div>
    </div>
    <div class="demo-block-body">
      <!-- Preview -->
      <div v-show="activeTab === 'preview'" class="demo-block-preview">
        <Suspense>
          <component :is="snippetComponent" />
          <template #fallback>
            <span class="demo-loading">加载中...</span>
          </template>
        </Suspense>
      </div>
      <!-- Code -->
      <div v-show="activeTab === 'code'" class="demo-block-code-wrapper">
        <slot name="snippet" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const props = defineProps<{
  idx: number
  path: string
  title: string
}>()

const activeTab = ref<'preview' | 'code'>('preview')

// content:1.style:3.button.md → 1.style/button
const snippetFile = computed(() => {
  const match = props.path.match(/^content:(\d+)\.(\w+):(\d+)\.(.+)\.md$/)
  if (match) {
    return `pages/demos/${match[1]}.${match[2]}/${match[4]}/snippet${props.idx}.vue`
  }
  return null
})

const snippetComponent = computed(() => {
  if (!snippetFile.value) return null
  const url = new URL(`../../${snippetFile.value}`, import.meta.url)
  return defineAsyncComponent({
    loader: () => import(/* @vite-ignore */ url.href),
    loadingComponent: { template: '<span class="demo-loading">加载中...</span>' },
  })
})
</script>

<style scoped>
.demo-block {
  margin: var(--spacing-2xl) 0;
  border: 1px solid var(--doc-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--doc-bg-primary);
  box-shadow: var(--shadow-sm);
  width: 100%;
}

.demo-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--doc-bg-secondary);
  border-bottom: 1px solid var(--doc-border-light);
}

.demo-block-title {
  font-size: var(--doc-font-size-md);
  font-weight: 500;
  color: var(--doc-text-secondary);
}

.demo-block-tabs {
  display: flex;
  gap: 2px;
  background: var(--doc-bg-primary);
  border-radius: var(--radius-md);
  padding: 2px;
}

.demo-tab {
  padding: 4px 12px;
  font-size: var(--doc-font-size-sm);
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  color: var(--doc-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.demo-tab:hover {
  color: var(--doc-text-secondary);
}

.demo-tab--active {
  background: var(--doc-bg-secondary);
  color: var(--doc-text-primary);
  font-weight: 500;
}

.demo-block-body {
  min-height: 80px;
}

.demo-block-preview {
  padding: var(--spacing-xl);
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: var(--spacing-xs);
  background: var(--doc-bg-primary);
}

.demo-block-code-wrapper {
  padding: var(--spacing-md);
  background: var(--doc-bg-secondary);
  overflow-x: auto;
}

.demo-block-code-wrapper :deep(pre),
.demo-block-code-wrapper :deep(.shiki) {
  margin: 0;
  padding: 0;
  background: transparent !important;
  font-size: var(--doc-font-size-xs);
  font-family: var(--doc-font-system);
  white-space: pre;
  overflow: visible;
  border: none !important;
}

.demo-block-code-wrapper :deep(code) {
  margin: 0;
  padding: 0;
  background: transparent;
  font-size: inherit;
  font-family: inherit;
  line-height: inherit;
  border: none !important;
  border-radius: 0;
}

.demo-block-code-wrapper :is(pre, .shiki, code) {
  border: none !important;
}

.demo-loading {
  font-size: 13px;
  color: var(--doc-text-tertiary);
}
</style>
