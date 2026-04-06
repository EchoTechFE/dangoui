<template>
  <div class="doc-stage">
    <IconsFlask class="doc-stage-icon" />
    <span class="doc-stage-text">该组件目前处于实验性状态，需要进行更加严密的测试，API 也可能发生比较大的变动</span>
  </div>
</template>

<style scoped>
.doc-stage {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  margin: var(--spacing-lg) 0;
  background: var(--doc-accent-bg);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(88, 84, 255, 0.15);
}

.doc-stage-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--doc-accent);
  margin-top: 2px;
}

.doc-stage-text {
  font-size: 13px;
  line-height: 1.5;
  color: var(--doc-text-secondary);
}
</style>
