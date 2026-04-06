<template>
  <DuTheme :name="globalTheme">
    <div class="doc-layout">
      <!-- Header -->
      <header class="doc-header">
      <div class="doc-header-inner">
        <NuxtLink to="/" class="doc-logo">
          <Logo />
          <span class="doc-logo-text">Dango UI</span>
          <span class="doc-badge">Beta</span>
        </NuxtLink>

        <!-- Search -->
        <div class="doc-search" ref="searchbar">
          <IconsSearch class="doc-search-icon" />
          <input
            ref="inputRef"
            v-model="keyword"
            placeholder="搜索文档..."
            class="doc-search-input"
            @keydown.esc="handleKeyEsc"
            @keydown.up.prevent="handleKeyUp"
            @keydown.down.prevent="handleKeyDown"
            @keydown.enter="handleEnter"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
          />
          <div class="doc-search-shortcut">
            <kbd>⌘</kbd><kbd>K</kbd>
          </div>
        </div>

        <!-- Search Results Dropdown -->
        <div
          ref="searchResult"
          :class="['doc-search-dropdown', { 'doc-search-dropdown--open': openSearchResult }]"
          :style="floatingStyles"
        >
          <template v-if="result.length">
            <NuxtLink
              v-for="item in result"
              :key="item._path"
              :href="item._path"
              :class="['doc-search-item', { 'doc-search-item--active': isActiveSearchItem(item) }]"
              @click="activeSearchItem = item._path"
            >
              {{ item.title }}
            </NuxtLink>
          </template>
          <div v-else class="doc-search-empty">没有结果</div>
        </div>

        <!-- Right Actions -->
        <div class="doc-actions">
          <button
            class="doc-action-btn doc-theme-toggle"
            @click="toggleTheme"
            :title="isDark ? '切换到日照' : '切换到暗黑'"
          >
            {{ isDark ? '☀️' : '🌙' }}
          </button>
          <a href="https://github.com/EchoTechFE/dangoui" target="_blank" class="doc-action-btn">
            <IconsGitHub />
          </a>
        </div>
      </div>
    </header>

    <!-- Theme Config Panel -->
    <Teleport to="body" v-if="isThemeConfigOpen">
      <div class="doc-modal-overlay" @click="isThemeConfigOpen = false"></div>
      <div class="doc-theme-panel">
        <div class="doc-theme-panel-header">
          <span>主题定制</span>
          <button class="doc-theme-panel-close" @click="isThemeConfigOpen = false">
            <span>✕</span>
          </button>
        </div>
        <div class="doc-theme-options">
          <button
            v-for="theme in themes"
            :key="theme.id"
            :class="['doc-theme-option', { 'doc-theme-option--active': globalTheme === theme.id }]"
            @click="handleThemeClick(theme.id)"
          >
            <div class="doc-theme-swatch" :style="{ background: theme.color }"></div>
            <span class="doc-theme-name">{{ theme.name }}</span>
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Sidebar -->
    <aside class="doc-sidebar">
      <OverlayScrollbarsComponent
        :options="{
          scrollbars: { autoHide: 'leave', autoHideDelay: 100 },
          overflow: { x: 'scroll', y: 'scroll' },
        }"
      >
        <nav class="doc-nav">
          <div v-for="navItem in navigation" :key="navItem.title" class="doc-nav-group">
            <div class="doc-nav-title">{{ navItem.title }}</div>
            <div class="doc-nav-list">
              <NuxtLink
                v-for="item in navItem.children ?? []"
                :key="item.title"
                :href="item._path"
                :class="['doc-nav-link', { 'doc-nav-link--active': isNavItemActive(item) }]"
              >
                <span>{{ item.title }}</span>
                <IconsFlask v-if="item.stage === 'alpha'" class="doc-nav-badge" />
              </NuxtLink>
            </div>
          </div>
        </nav>
      </OverlayScrollbarsComponent>
    </aside>

    <!-- Main Content -->
    <main class="doc-content">
      <slot />
    </main>

    <!-- Outline (right sidebar) -->
    <aside class="doc-outline">
      <div class="doc-outline-title">本页内容</div>
      <nav class="doc-outline-nav">
        <template v-if="md?.body?.toc?.links">
          <a
            v-for="link in md.body.toc.links"
            :key="link.id"
            :href="`#${link.id}`"
            :class="['doc-outline-link', { 'doc-outline-link--active': isLinkActive(link) }]"
          >
            {{ link.text }}
          </a>
        </template>
      </nav>
    </aside>
  </div>
  </DuTheme>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'
import { DuTheme } from 'dangoui'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import { useFloating, offset } from '@floating-ui/vue'
import { useThrottleFn, useEventListener } from '@vueuse/core'
import hotkeys from 'hotkeys-js'

const { data: navigation } = await useAsyncData('navigation', () =>
  fetchContentNavigation(),
)

const route = useRoute()

// Search
const openSearchResult = ref(false)
const searchbar = ref<HTMLDivElement>()
const searchResult = ref<HTMLDivElement>()
const { floatingStyles } = useFloating(searchbar, searchResult, {
  placement: 'bottom-start',
  middleware: [offset(8)],
})

const inputRef = ref<HTMLInputElement>()
const keyword = ref('')
const result = ref<NavItem[]>([])
const activeSearchItem = ref('')

const themes = [
  { id: 'qd', name: '千岛紫', color: '#5854ff' },
  { id: 'qh', name: '奇货橙', color: '#ff812c' },
  { id: 'qdm', name: '商家蓝', color: '#1677ff' },
  { id: 'mihua-light', name: '米花绿·日照', color: '#aef056' },
  { id: 'mihua-dark', name: '米花绿·暗黑', color: '#aef056' },
]

watch(keyword, (kw) => {
  result.value = navigation.value
    ?.flatMap((item) => item.children ?? [])
    .filter((item) => item.title.toLowerCase().includes(kw.toLowerCase()))
    .slice(0, 8) ?? []
})

onMounted(() => {
  hotkeys('command+k, ctrl+k', (e) => {
    e.preventDefault()
    inputRef.value?.focus()
  })
})

onUnmounted(() => {
  hotkeys.unbind('command+k, ctrl+k')
})

function handleInputFocus() {
  openSearchResult.value = true
}

function handleInputBlur() {
  setTimeout(() => {
    openSearchResult.value = false
  }, 200)
}

function handleKeyEsc() {
  inputRef.value?.blur()
}

function handleKeyUp() {
  if (!result.value.length) return
  const idx = result.value.findIndex((item) => item._path === activeSearchItem.value)
  activeSearchItem.value = idx <= 0
    ? result.value[result.value.length - 1]._path!
    : result.value[idx - 1]._path!
}

function handleKeyDown() {
  if (!result.value.length) return
  const idx = result.value.findIndex((item) => item._path === activeSearchItem.value)
  activeSearchItem.value = idx >= result.value.length - 1
    ? result.value[0]._path!
    : result.value[idx + 1]._path!
}

function handleEnter() {
  if (activeSearchItem.value) {
    navigateTo(activeSearchItem.value)
    inputRef.value?.blur()
  }
}

function isActiveSearchItem(item: NavItem) {
  return item._path === activeSearchItem.value
}

// Theme
const isDark = computed(() => globalTheme.value.includes('dark'))

function toggleTheme() {
  globalTheme.value = isDark.value ? 'qd' : 'qd-dark'
  localStorage.setItem('DANGOUI_THEME', globalTheme.value)
  nextTick(() => handleScroll())
}

const isThemeConfigOpen = ref(false)

function handleThemeClick(theme: string) {
  globalTheme.value = theme
  localStorage.setItem('DANGOUI_THEME', theme)
  nextTick(() => handleScroll())
}

// Navigation
const { data: md } = await useAsyncData(route.path, () =>
  queryContent(route.path === '/' ? '/get-started/introduction' : route.path).findOne(),
)

const linksWithStatus = ref<{ id: string; isActive: boolean }[]>([])

function isLinkActive(link: { id: string }) {
  return linksWithStatus.value.some((l) => l.id === link.id && l.isActive)
}

function isNavItemActive(item: NavItem) {
  return item._path === route.path
}

const handleScroll = useThrottleFn(() => {
  if (md.value?.body?.toc?.links) {
    const links = md.value.body.toc.links
    const height = window.innerHeight
    linksWithStatus.value = links.map((link, idx) => {
      const el = document.querySelector(`#${link.id}`)
      if (!el) return { id: link.id, isActive: false }
      const rect = el.getBoundingClientRect()
      const next = links[idx + 1]
      const nextRect = next ? document.querySelector(`#${next.id}`)?.getBoundingClientRect() : null
      return {
        id: link.id,
        isActive: rect.y > 0 && rect.y < height * 0.5
          || (nextRect && nextRect.y < 0 && rect.y >= 0)
          || (!next && rect.y < height)
      }
    })
  }
}, 200)

useEventListener('scroll', handleScroll)
onMounted(() => handleScroll())
</script>

<style>
/* ── Layout ── */
.doc-layout {
  min-height: 100vh;
  background: var(--doc-bg-primary);
}

.doc-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--doc-header-h);
  background: var(--doc-header-bg);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--doc-border-light);
  z-index: 100;
}

.doc-header-inner {
  display: flex;
  align-items: center;
  height: 100%;
  max-width: calc(var(--doc-layout-max-w) + var(--doc-sidebar-w) + var(--spacing-3xl) * 2);
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
  gap: var(--spacing-lg);
}

/* ── Logo ── */
.doc-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  flex-shrink: 0;
}

.doc-logo-text {
  font-family: var(--doc-font-system);
  font-size: 15px;
  font-weight: 600;
  color: var(--doc-text-primary);
  letter-spacing: -0.01em;
}

.doc-badge {
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  background: var(--doc-accent-bg);
  color: var(--doc-accent);
  letter-spacing: 0.02em;
}

/* ── Search ── */
.doc-search {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  max-width: 320px;
  height: 32px;
  padding: 0 var(--spacing-md);
  background: var(--doc-bg-secondary);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}

.doc-search:focus-within {
  background: var(--doc-bg-primary);
  border-color: var(--doc-border);
  box-shadow: var(--shadow-sm);
}

.doc-search-icon {
  width: 14px;
  height: 14px;
  color: var(--doc-text-tertiary);
  flex-shrink: 0;
}

.doc-search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--doc-text-primary);
  outline: none;
}

.doc-search-input::placeholder {
  color: var(--doc-text-placeholder);
}

.doc-search-shortcut {
  display: flex;
  gap: 2px;
}

.doc-search-shortcut kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  font-size: 10px;
  font-family: var(--doc-font-system);
  background: var(--doc-bg-primary);
  border: 1px solid var(--doc-border);
  border-radius: 4px;
  color: var(--doc-text-tertiary);
}

.doc-search-dropdown {
  position: fixed;
  top: calc(var(--doc-header-h) + var(--spacing-sm));
  width: 320px;
  background: var(--doc-bg-primary);
  border: 1px solid var(--doc-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  opacity: 0;
  transform: translateY(-8px);
  pointer-events: none;
  transition: var(--transition-base);
}

.doc-search-dropdown--open {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.doc-search-item {
  display: block;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 13px;
  color: var(--doc-text-secondary);
  text-decoration: none;
  transition: var(--transition-fast);
}

.doc-search-item:hover,
.doc-search-item--active {
  background: var(--doc-bg-secondary);
  color: var(--doc-text-primary);
}

.doc-search-empty {
  padding: var(--spacing-xl);
  text-align: center;
  font-size: 13px;
  color: var(--doc-text-tertiary);
}

/* ── Actions ── */
.doc-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-left: auto;
}

.doc-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  color: var(--doc-text-secondary);
  cursor: pointer;
  transition: var(--transition-fast);
  text-decoration: none;
}

.doc-action-btn:hover {
  background: var(--doc-bg-secondary);
  color: var(--doc-text-primary);
}

.doc-action-btn svg {
  width: 18px;
  height: 18px;
}

/* ── Theme Panel ── */
.doc-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
}

.doc-theme-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  background: var(--doc-bg-primary);
  box-shadow: var(--shadow-xl);
  z-index: 201;
  animation: slideIn 200ms ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.doc-theme-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--doc-border-light);
  font-size: 15px;
  font-weight: 600;
  color: var(--doc-text-primary);
}

.doc-theme-panel-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  color: var(--doc-text-tertiary);
  cursor: pointer;
  transition: var(--transition-fast);
}

.doc-theme-panel-close:hover {
  background: var(--doc-bg-secondary);
  color: var(--doc-text-primary);
}

.doc-theme-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
}

.doc-theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border: 2px solid transparent;
  background: transparent;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition-fast);
}

.doc-theme-option:hover {
  background: var(--doc-bg-secondary);
}

.doc-theme-option--active {
  border-color: var(--doc-accent);
  background: var(--doc-accent-bg);
}

.doc-theme-swatch {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.doc-theme-name {
  font-size: 12px;
  color: var(--doc-text-secondary);
}

/* ── Sidebar ── */
.doc-sidebar {
  position: fixed;
  top: var(--doc-header-h);
  left: 0;
  bottom: 0;
  width: var(--doc-sidebar-w);
  background: var(--doc-sidebar-bg);
  border-right: 1px solid var(--doc-border-light);
}

.doc-nav {
  padding: var(--spacing-xl) var(--spacing-md);
}

.doc-nav-group {
  margin-bottom: var(--spacing-xl);
}

.doc-nav-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--doc-text-tertiary);
  padding: 0 var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.doc-nav-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.doc-nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-sm);
  font-size: 13px;
  color: var(--doc-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}

.doc-nav-link:hover {
  background: var(--doc-bg-secondary);
  color: var(--doc-text-primary);
}

.doc-nav-link--active {
  background: var(--doc-accent-bg);
  color: var(--doc-accent);
  font-weight: 500;
}

.doc-nav-link--active:hover {
  background: var(--doc-accent-bg-hover);
  color: var(--doc-accent-hover);
}

.doc-nav-badge {
  width: 14px;
  height: 14px;
  color: var(--doc-text-tertiary);
}

.doc-nav-link--active .doc-nav-badge {
  color: var(--doc-accent);
}

/* ── Content ── */
.doc-content {
  min-height: calc(100vh - var(--doc-header-h));
  padding: var(--spacing-3xl) var(--spacing-4xl);
  margin-left: var(--doc-sidebar-w);
  margin-right: var(--doc-outline-w);
  max-width: calc(var(--doc-layout-max-w) + var(--doc-outline-w));
}

/* ── Outline ── */
.doc-outline {
  position: fixed;
  top: var(--doc-header-h);
  right: 0;
  bottom: 0;
  width: var(--doc-outline-w);
  padding: var(--spacing-xl) var(--spacing-lg);
  overflow: hidden;
}

.doc-outline-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--doc-text-tertiary);
  margin-bottom: var(--spacing-md);
}

.doc-outline-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.doc-outline-link {
  display: block;
  font-size: 12px;
  color: var(--doc-text-tertiary);
  text-decoration: none;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
  line-height: 1.5;
}

.doc-outline-link:hover {
  color: var(--doc-text-secondary);
  background: var(--doc-bg-secondary);
}

.doc-outline-link--active {
  color: var(--doc-accent);
  background: var(--doc-accent-bg);
}

/* ── Responsive ── */
@media (max-width: 1200px) {
  .doc-outline {
    display: none;
  }

  .doc-content {
    margin-right: 0;
  }
}

@media (max-width: 768px) {
  .doc-sidebar {
    display: none;
  }

  .doc-content {
    margin-left: 0;
    padding: var(--spacing-xl);
  }
}
</style>
