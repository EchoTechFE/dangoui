<template>
  <article class="doc-article">
    <ContentDoc class="doc-prose prose" />

    <nav class="doc-nav-footer">
      <NuxtLink
        v-if="surround?.[0]"
        :to="surround[0]._path"
        class="doc-nav-prev"
      >
        <span class="doc-nav-label">上一篇</span>
        <span class="doc-nav-title">{{ surround[0].title }}</span>
      </NuxtLink>
      <div v-else />

      <NuxtLink
        v-if="surround?.[1]"
        :to="surround[1]._path"
        class="doc-nav-next"
      >
        <span class="doc-nav-label">下一篇</span>
        <span class="doc-nav-title">{{ surround[1].title }}</span>
      </NuxtLink>
      <div v-else />
    </nav>
  </article>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'doc',
})

const route = useRoute()

const contentPath = computed(() => route.path === '/' ? '/get-started/introduction' : route.path)

const { data: md } = await useAsyncData(
  'content:' + route.path,
  () => queryContent(contentPath.value).findOne(),
  { watch: [contentPath] },
)

const { data: surround } = await useAsyncData(
  'surround:' + route.path,
  () => queryContent()
    .only(['_path', 'title'])
    .where({ _partial: false })
    .findSurround(contentPath.value),
  { watch: [contentPath] },
)
</script>

<style>
/* ── Article ── */
.doc-article {
  width: 100%;
}

/* ── Typography Prose ── */
.doc-prose {
  font-family: var(--doc-font-system);
  font-size: 15px;
  line-height: 1.7;
  color: var(--doc-text-primary);
  max-width: none;
}

.doc-prose.prose {
  max-width: none;
  width: 100%;
}

.doc-prose.prose > * {
  max-width: 100% !important;
}

.doc-prose h1 {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--doc-text-primary);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--doc-border-light);
}

.doc-prose h2 {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--doc-text-primary);
  margin-top: var(--spacing-3xl);
  margin-bottom: var(--spacing-lg);
}

.doc-prose h3 {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--doc-text-primary);
  margin-top: var(--spacing-2xl);
  margin-bottom: var(--spacing-md);
}

.doc-prose p {
  margin-bottom: var(--spacing-lg);
  color: var(--doc-text-secondary);
}

.doc-prose a {
  color: var(--doc-accent);
  text-decoration: none;
  transition: var(--transition-fast);
}

.doc-prose a:hover {
  text-decoration: underline;
}

.doc-prose ul,
.doc-prose ol {
  margin-bottom: var(--spacing-lg);
  padding-left: var(--spacing-xl);
  color: var(--doc-text-secondary);
}

.doc-prose li {
  margin-bottom: var(--spacing-sm);
}

.doc-prose code {
  font-family: var(--doc-font-mono);
  font-size: 0.9em;
  padding: 2px 6px;
  background: var(--doc-bg-secondary);
  border-radius: var(--radius-sm);
  color: var(--doc-accent);
}

.doc-prose pre {
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-lg);
  background: var(--doc-bg-secondary);
  border-radius: var(--radius-lg);
  overflow-x: auto;
  white-space: pre;
  border: none !important;
}

.doc-prose :is(pre, .shiki, code) {
  border: none !important;
}

.doc-prose pre code {
  padding: 0;
  background: transparent;
  color: var(--doc-text-primary);
  font-size: var(--doc-font-size-xs);
  line-height: var(--doc-line-height-tight);
  white-space: pre;
}

.doc-prose blockquote {
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-left: 3px solid var(--doc-accent);
  background: var(--doc-accent-bg);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  color: var(--doc-text-secondary);
}

.doc-prose hr {
  margin: var(--spacing-3xl) 0;
  border: none;
  border-top: 1px solid var(--doc-border-light);
}

.doc-prose table {
  width: 100%;
  margin: var(--spacing-xl) 0;
  border-collapse: collapse;
  font-size: 14px;
}

.doc-prose th,
.doc-prose td {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--doc-border-light);
}

.doc-prose th {
  font-weight: 600;
  color: var(--doc-text-primary);
  background: var(--doc-bg-secondary);
}

.doc-prose td {
  color: var(--doc-text-secondary);
}

/* ── Navigation Footer ── */
.doc-nav-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-4xl);
  padding-top: var(--spacing-2xl);
  border-top: 1px solid var(--doc-border-light);
}

.doc-nav-prev,
.doc-nav-next {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-lg);
  background: var(--doc-bg-secondary);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: var(--transition-fast);
}

.doc-nav-prev:hover,
.doc-nav-next:hover {
  background: var(--doc-bg-tertiary);
}

.doc-nav-next {
  text-align: right;
  align-items: flex-end;
}

.doc-nav-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--doc-text-tertiary);
}

.doc-nav-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--doc-accent);
}
</style>
