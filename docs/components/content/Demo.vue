<template>
  <section class="demo-block">
    <div class="demo-block-header">
      <span class="demo-block-title">{{ title }}</span>
    </div>
    <div class="demo-block-content">
      <div class="demo-block-preview">
        <Suspense>
          <component :is="snippetComponent" />
          <template #fallback>
            <span class="demo-loading">加载中...</span>
          </template>
        </Suspense>
      </div>
      <div class="demo-block-code">
        <div class="demo-block-code-header">
          <span class="demo-block-code-title">代码示例</span>
        </div>
        <div class="demo-block-code-content">
          <OverlayScrollbarsComponent
            class="demo-block-scroll"
            :options="{
              scrollbars: { autoHide: 'leave', autoHideDelay: 100 },
              overflow: { x: 'scroll', y: 'scroll' },
            }"
            defer
          >
            <slot name="snippet" />
          </OverlayScrollbarsComponent>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import { defineAsyncComponent } from 'vue'

const props = defineProps<{
  idx: number
  path: string
  title: string
}>()

// content:1.style:3.button.md → 1.style/button
const snippetFile = computed(() => {
  // props.path like "content:1.style:3.button.md"
  const match = props.path.match(/^content:(\d+)\.(\w+):(\d+)\.(.+)\.md$/)
  if (match) {
    return `pages/demos/${match[1]}.${match[2]}/${match[4]}/snippet${props.idx}.vue`
  }
  return null
})

const snippetComponent = computed(() => {
  if (!snippetFile.value) return null
  // Use new URL for Vite-compatible dynamic import
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
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--doc-bg-secondary);
  border-bottom: 1px solid var(--doc-border-light);
}

.demo-block-title {
  font-size: var(--doc-font-size-md);
  font-weight: 500;
  color: var(--doc-text-secondary);
}

.demo-block-content {
  display: grid;
  grid-template-columns: 3fr 2fr;
  min-height: 120px;
}

.demo-block-code {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.demo-block-preview {
  padding: var(--spacing-md);
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: var(--spacing-xs);
  border-right: 1px solid var(--doc-border-light);
  background: var(--doc-bg-primary);
}

.demo-block-code {
  display: flex;
  flex-direction: column;
  background: var(--doc-bg-secondary);
}

.demo-block-code-header {
  padding: var(--spacing-xs) var(--spacing-md);
  border-bottom: 1px solid var(--doc-border-light);
}

.demo-block-code-title {
  font-size: var(--doc-font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--doc-text-tertiary);
}

.demo-block-code-content {
  flex: 1;
  overflow: hidden;
}

.demo-block-scroll {
  height: 100%;
  padding: var(--spacing-sm);
  font-size: var(--doc-font-size-xs);
  line-height: var(--doc-line-height-tight);
  overflow-x: auto;
  white-space: pre;
}

@media (max-width: 768px) {
  .demo-block-content {
    grid-template-columns: 1fr;
  }

  .demo-block-preview {
    border-right: none;
    border-bottom: 1px solid var(--doc-border-light);
  }
}

.demo-loading {
  font-size: 13px;
  color: var(--doc-text-tertiary);
}
</style>
