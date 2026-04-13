<template>
  <DuTheme :name="globalTheme">
    <div class="min-h-100vh bg-[var(--doc-bg-primary)]">
      <!-- Header -->
      <header class="fixed top-0 left-0 right-0 h-[var(--doc-header-h)] bg-[var(--doc-header-bg)] backdrop-blur-20 backdrop-saturate-180 border-b border-b-solid border-b-[var(--doc-border-light)] z-100">
        <div class="flex items-center h-full px-[var(--spacing-xl)] gap-4px w-full">
          <NuxtLink to="/" class="flex items-center gap-[var(--spacing-sm)] no-underline shrink-0">
            <Logo />
            <span class="font-[var(--doc-font-system)] text-15px font-600 c-[var(--doc-text-primary)] tracking-[-0.01em] hidden md:inline">Dango UI</span>
            <span class="text-10px font-500 py-2px px-6px rounded-[var(--radius-sm)] bg-[var(--doc-accent-bg)] c-[var(--doc-accent)] tracking-[0.02em] hidden sm:inline">Beta</span>
          </NuxtLink>

          <!-- Search -->
          <div class="doc-search flex items-center gap-[var(--spacing-sm)] h-32px px-[var(--spacing-md)] bg-[var(--doc-bg-secondary)] border border-solid border-transparent rounded-[var(--radius-md)] transition-all" ref="searchbar">
            <IconsSearch class="w-14px h-14px c-[var(--doc-text-tertiary)] shrink-0" />
            <input
              ref="inputRef"
              v-model="keyword"
              placeholder="搜索文档..."
              class="flex-1 border-none bg-transparent text-13px c-[var(--doc-text-primary)] outline-none placeholder-[var(--doc-text-placeholder)]"
              @keydown.esc="handleKeyEsc"
              @keydown.up.prevent="handleKeyUp"
              @keydown.down.prevent="handleKeyDown"
              @keydown.enter="handleEnter"
              @focus="handleInputFocus"
              @blur="handleInputBlur"
            />
            <div class="flex gap-2px hidden sm:flex">
              <kbd :class="kbdClass">⌘</kbd>
              <kbd :class="kbdClass">K</kbd>
            </div>
          </div>

          <!-- Search Results Dropdown -->
          <div
            ref="searchResult"
            :class="[
              'fixed top-[calc(var(--doc-header-h)+var(--spacing-sm))] w-320px bg-[var(--doc-bg-primary)] border border-solid border-[var(--doc-border)] rounded-[var(--radius-lg)] shadow-lg overflow-hidden transition-all duration-200',
              openSearchResult ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-[-8px] pointer-events-none',
            ]"
            :style="floatingStyles"
          >
            <template v-if="result.length">
              <NuxtLink
                v-for="item in result"
                :key="item._path"
                :to="item._path"
                :class="[
                  'block py-[var(--spacing-sm)] px-[var(--spacing-md)] text-13px no-underline transition-all',
                  isActiveSearchItem(item) ? 'bg-[var(--doc-bg-secondary)] c-[var(--doc-text-primary)]' : 'c-[var(--doc-text-secondary)] hover:bg-[var(--doc-bg-secondary)] hover:c-[var(--doc-text-primary)]',
                ]"
                @click="activeSearchItem = item._path"
              >
                {{ item.title }}
              </NuxtLink>
            </template>
            <div v-else class="py-[var(--spacing-xl)] text-center text-13px c-[var(--doc-text-tertiary)]">没有结果</div>
          </div>

          <!-- App Segment Control -->
          <div class="flex items-center gap-2px h-32px px-2px bg-[var(--doc-bg-secondary)] rounded-[var(--radius-md)] ml-auto">
            <button
              v-for="app in apps"
              :key="app.id"
              :class="[
                'flex items-center justify-center h-28px border-none rounded-[var(--radius-sm)] cursor-pointer transition-all gap-4px',
                currentApp === app.id ? 'bg-[var(--doc-bg-primary)] shadow-sm' : 'bg-transparent hover:bg-[var(--doc-bg-primary)]',
              ]"
              @click="handleAppClick(app.id)"
              :title="app.name"
            >
              <DuTheme :name="app.id" class="w-8px h-8px rounded-full shrink-0 bg-[var(--du-primary-solid-bg)]" :class="{ 'scale-120': currentApp === app.id }" />
              <span :class="['text-11px whitespace-nowrap hidden lg:inline', currentApp === app.id ? 'c-[var(--doc-text-primary)] font-500' : 'c-[var(--doc-text-tertiary)]']">{{ app.name }}</span>
            </button>
          </div>

          <div class="flex items-center gap-4px">
            <button
              :class="actionBtnClass"
              @click="toggleTheme"
              :title="isDarkMode ? '切换到日照' : '切换到暗黑'"
            >
              {{ isDarkMode ? '☀️' : '🌙' }}
            </button>
            <a href="https://github.com/EchoTechFE/dangoui" target="_blank" :class="actionBtnClass">
              <IconsGitHub />
            </a>
          </div>
        </div>
      </header>

      <!-- Sidebar -->
      <aside class="doc-sidebar fixed top-[var(--doc-header-h)] left-0 bottom-0 w-[var(--doc-sidebar-w)] bg-[var(--doc-sidebar-bg)] border-r border-r-solid border-r-[var(--doc-border-light)] overflow-y-auto">
        <nav class="p-[var(--spacing-xl)_var(--spacing-md)]">
          <div v-for="navItem in navigation" :key="navItem.title" class="mb-[var(--spacing-xl)]">
            <div class="text-10px font-600 uppercase tracking-[0.05em] c-[var(--doc-text-tertiary)] px-[var(--spacing-sm)] mb-[var(--spacing-sm)]">{{ navItem.title }}</div>
            <div class="flex flex-col gap-2px">
              <NuxtLink
                v-for="item in navItem.children ?? []"
                :key="item.title"
                :to="item._path"
                :class="[
                  'flex items-center justify-between p-[var(--spacing-sm)] text-11px no-underline rounded-[var(--radius-md)] transition-all',
                  isNavItemActive(item)
                    ? 'bg-[var(--doc-accent-bg)] c-[var(--doc-accent)] font-500 hover:bg-[var(--doc-accent-bg-hover)] hover:c-[var(--doc-accent-hover)]'
                    : 'c-[var(--doc-text-secondary)] hover:bg-[var(--doc-bg-secondary)] hover:c-[var(--doc-text-primary)]',
                ]"
              >
                <span>{{ item.title }}</span>
                <IconsFlask v-if="item.stage === 'alpha'" :class="['w-14px h-14px', isNavItemActive(item) ? 'c-[var(--doc-accent)]' : 'c-[var(--doc-text-tertiary)]']" />
              </NuxtLink>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="doc-content min-h-[calc(100vh-var(--doc-header-h))] py-64px px-[var(--spacing-2xl)] ml-[var(--doc-sidebar-w)] mr-[var(--doc-outline-w)]">
        <slot />
      </main>

      <!-- Outline -->
      <aside class="doc-outline fixed top-[var(--doc-header-h)] right-0 bottom-0 w-[var(--doc-outline-w)] p-[var(--spacing-xl)_var(--spacing-lg)] overflow-hidden">
        <div class="text-10px font-600 uppercase tracking-[0.05em] c-[var(--doc-text-tertiary)] mb-[var(--spacing-sm)]">本页内容</div>
        <nav class="flex flex-col gap-4px">
          <template v-if="md?.body?.toc?.links">
            <a
              v-for="link in md.body.toc.links"
              :key="link.id"
              :href="`#${link.id}`"
              :class="[
                'block text-10px no-underline p-[var(--spacing-xs)_var(--spacing-sm)] rounded-[var(--radius-sm)] transition-all leading-[1.5]',
                activeLinkId === link.id
                  ? 'c-[var(--doc-accent)] bg-[var(--doc-accent-bg)]'
                  : 'c-[var(--doc-text-tertiary)] hover:c-[var(--doc-text-secondary)] hover:bg-[var(--doc-bg-secondary)]',
              ]"
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

// Shared classes
const kbdClass = 'inline-flex items-center justify-center min-w-18px h-18px px-4px text-10px font-[var(--doc-font-system)] bg-[var(--doc-bg-primary)] border border-solid border-[var(--doc-border)] rounded-4px c-[var(--doc-text-tertiary)]'
const actionBtnClass = 'flex items-center justify-center w-32px h-32px border-none bg-[var(--doc-bg-secondary)] rounded-[var(--radius-md)] c-[var(--doc-text-secondary)] cursor-pointer transition-all no-underline hover:bg-[var(--doc-bg-tertiary)] hover:c-[var(--doc-text-primary)] [&>svg]:w-18px [&>svg]:h-18px'

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
    ?.flatMap((item: any) => item.children ?? [])
    .filter((item: any) => item.title.toLowerCase().includes(kw.toLowerCase()))
    .slice(0, 8) ?? []
})

onMounted(() => {
  hotkeys('command+k, ctrl+k', (e) => {
    e.preventDefault()
    inputRef.value?.focus()
  })
  handleScroll()
})

onUnmounted(() => {
  hotkeys.unbind('command+k, ctrl+k')
})

function isActiveSearchItem(item: NavItem) {
  return item._path === activeSearchItem.value
}

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
  const idx = result.value.findIndex((item: any) => item._path === activeSearchItem.value)
  activeSearchItem.value = idx <= 0
    ? result.value[result.value.length - 1]._path!
    : result.value[idx - 1]._path!
}

function handleKeyDown() {
  if (!result.value.length) return
  const idx = result.value.findIndex((item: any) => item._path === activeSearchItem.value)
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

// Theme
function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('DANGOUI_THEME', globalTheme.value)
}

function handleAppClick(appId: string) {
  currentApp.value = appId
  localStorage.setItem('DANGOUI_THEME', globalTheme.value)
}

// Navigation
function isNavItemActive(item: any) {
  return item._path === route.path
}

// Outline
const currentPath = computed(() => route.path === '/' ? '/get-started/introduction' : route.path)
const md = ref<any>(null)

watch(currentPath, async (path) => {
  const data = await queryContent(path).findOne()
  md.value = data
}, { immediate: true })

const activeLinkId = ref('')

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

    let firstVisibleIdx = -1
    for (let i = 0; i < links.length; i++) {
      const el = document.querySelector(`#${links[i].id}`)
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (rect.y <= height * 0.5) {
        firstVisibleIdx = i
      }
    }

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

    if (scrollY < 50) {
      firstVisibleIdx = 0
    }

    activeLinkId.value = firstVisibleIdx >= 0 ? links[firstVisibleIdx].id : ''
  }
}, 100)

useEventListener('scroll', handleScroll)
</script>

<style>
/* Search focus-within (UnoCSS can't target parent from child focus) */
.doc-search:focus-within {
  background: var(--doc-bg-primary);
  border-color: var(--doc-border);
  box-shadow: var(--shadow-sm);
}

/* Responsive — 1100px is non-standard, keep in CSS */
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
