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

        <!-- App Segment Control -->
        <div class="doc-app-segment">
          <button
            v-for="app in apps"
            :key="app.id"
            :class="['doc-app-btn', { 'doc-app-btn--active': currentApp === app.id }]"
            @click="handleAppClick(app.id)"
            :title="app.name"
          >
            <span class="doc-app-dot" :class="`du-theme-${app.id}`"></span>
            <span class="doc-app-name">{{ app.name }}</span>
          </button>
        </div>

        <div class="doc-header-right">
          <!-- Theme Toggle -->
          <button
            class="doc-action-btn doc-theme-toggle"
            @click="toggleTheme"
            :title="isDarkMode ? '切换到日照' : '切换到暗黑'"
          >
            {{ isDarkMode ? '☀️' : '🌙' }}
          </button>

          <a href="https://github.com/EchoTechFE/dangoui" target="_blank" class="doc-action-btn">
            <IconsGitHub />
          </a>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside class="doc-sidebar">
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
            :style="activeLinkId === link.id ? 'color: var(--doc-accent); background: var(--doc-accent-bg);' : ''"
            class="doc-outline-link"
            @click.prevent="handleOutlineClick(link)"
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
import { useFloating, offset } from '@floating-ui/vue'
import { globalTheme, currentApp, isDarkMode } from '~/composables/dumpling'
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

const apps = [
  { id: 'qd', name: '千岛' },
  { id: 'qh', name: '奇货' },
  { id: 'qdm', name: '商家' },
  { id: 'mihua', name: '米花' },
  { id: 'linjie', name: '临界' },
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
function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('DANGOUI_THEME', globalTheme.value)
  console.log('[toggleTheme] isDarkMode:', isDarkMode.value, '→ globalTheme:', globalTheme.value, '→ currentApp:', currentApp.value)
  nextTick(() => handleScroll())
}

function handleAppClick(appId: string) {
  currentApp.value = appId
  localStorage.setItem('DANGOUI_THEME', globalTheme.value)
  console.log('[handleAppClick] appId:', appId, 'isDarkMode:', isDarkMode.value, '→ globalTheme:', globalTheme.value)
  nextTick(() => handleScroll())
}

// Navigation
const currentPath = computed(() => route.path === '/' ? '/get-started/introduction' : route.path)
const md = ref(null)

watch(currentPath, async (path) => {
  const result = await queryContent(path).findOne()
  md.value = result
}, { immediate: true })

const activeLinkId = ref<string>('')

function isNavItemActive(item: NavItem) {
  return item._path === route.path
}

function handleOutlineClick(link: { id: string; text: string }) {
  if (!link.id) return
  activeLinkId.value = link.id
  const target = document.querySelector(`#${link.id}`)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleScroll = useThrottleFn(() => {
  if (md.value?.body?.toc?.links) {
    const links = md.value.body.toc.links
    const height = window.innerHeight
    const scrollY = window.scrollY

    // Find the first heading that is currently visible (in or above viewport)
    let firstVisibleIdx = -1
    for (let i = 0; i < links.length; i++) {
      const el = document.querySelector(`#${links[i].id}`)
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (rect.y <= height * 0.5) {
        firstVisibleIdx = i
      }
    }

    // If no heading is in upper half, find the last heading that's above viewport
    if (firstVisibleIdx === -1) {
      for (let i = links.length - 1; i >= 0; i--) {
        const el = document.querySelector(`#${links[i].id}`)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.y < 0) {
          firstVisibleIdx = i + 1 < links.length ? i + 1 : i
          break
        }
      }
    }

    // 如果页面在顶部，第一个应该高亮
    if (scrollY < 50) {
      firstVisibleIdx = 0
    }

    const newActiveId = firstVisibleIdx >= 0 ? links[firstVisibleIdx].id : ''
    activeLinkId.value = newActiveId
  }
}, 100)

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
  gap: 4px;
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
  background: var(--doc-bg-secondary);
  border-radius: var(--radius-md);
  color: var(--doc-text-secondary);
  cursor: pointer;
  transition: var(--transition-fast);
  text-decoration: none;
}

.doc-action-btn:hover {
  background: var(--doc-bg-tertiary);
  color: var(--doc-text-primary);
}

.doc-action-btn svg {
  width: 18px;
  height: 18px;
}

.doc-theme-toggle {
  margin-left: 0;
}

/* ── App Segment ── */
.doc-app-segment {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 32px;
  padding: 0 2px;
  background: var(--doc-bg-secondary);
  border-radius: var(--radius-md);
  margin-left: auto;
}

.doc-header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.doc-app-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 8px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition-fast);
  gap: 4px;
}

.doc-app-btn:hover {
  background: var(--doc-bg-primary);
}

.doc-app-btn--active {
  background: var(--doc-bg-primary);
  box-shadow: var(--shadow-sm);
}

.doc-app-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--du-primary-solid-bg);
}

.doc-app-btn--active .doc-app-dot {
  transform: scale(1.2);
}

.doc-app-name {
  font-size: 11px;
  color: var(--doc-text-tertiary);
  white-space: nowrap;
}

.doc-app-btn--active .doc-app-name {
  color: var(--doc-text-primary);
  font-weight: 500;
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
  overflow-y: auto;
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
  padding: 64px var(--spacing-2xl);
  margin-left: var(--doc-sidebar-w);
  margin-right: var(--doc-outline-w);
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
@media (max-width: 1100px) {
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
