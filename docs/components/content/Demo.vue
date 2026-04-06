<template>
  <section class="demo-block">
    <div class="demo-block-header">
      <span class="demo-block-title">{{ title }}</span>
    </div>
    <div class="demo-block-content">
      <div class="demo-block-preview">
        <slot />
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

const props = defineProps<{
  idx: number
  path: string
  title: string
}>()
</script>

<style scoped>
.demo-block {
  margin: var(--spacing-2xl) 0;
  border: 1px solid var(--doc-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--doc-bg-primary);
  box-shadow: var(--shadow-sm);
}

.demo-block-header {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--doc-bg-secondary);
  border-bottom: 1px solid var(--doc-border-light);
}

.demo-block-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--doc-text-secondary);
}

.demo-block-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 280px;
}

.demo-block-preview {
  padding: var(--spacing-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--doc-border-light);
  background: var(--doc-bg-primary);
}

.demo-block-code {
  display: flex;
  flex-direction: column;
  background: var(--doc-bg-secondary);
}

.demo-block-code-header {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-bottom: 1px solid var(--doc-border-light);
}

.demo-block-code-title {
  font-size: 11px;
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
  padding: var(--spacing-lg);
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
</style>
