<template>
  <div
    class="h-$doc-header-h fixed top-0 left-0 flex items-center justify-between w-full bg-white z-1000"
  >
    <div
      class="doc-logo pl-8px flex items-center w-$doc-sidebar-w border-r border-r-solid border-r-border-2 h-full"
    >
      <Logo />
      <div class="fw-500">Dango UI</div>
      <div class="bg-orange c-white rounded-4px text-sm px-4px ml-4px">
        Beta
      </div>
    </div>
    <div class="doc-header-right flex flex-auto items-center justify-between">
      <div
        class="ml-16px border border-gray-200 rounded-4px py-4px px-8px text-14px flex items-center gap-x-8px text-neutral-800 cursor-pointer"
        ref="searchbar"
      >
        <IconsSearch class="text-16px" />
        <input
          ref="inputRef"
          placeholder="搜索..."
          class="outline-none w-200px"
          v-model="keyword"
          @keydown.esc="handleKeyEsc"
          @keydown.up.prevent
          @keydown.down.prevent
          @keyup.up="handleKeyUp"
          @keyup.down="handleKeyDown"
          @keydown.enter="handleEnter"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
        />
        <div class="flex items-center gap-x-4px">
          <div
            v-for="k in shortcuts"
            :key="k"
            class="rounded-4px bg-slate-50 border border-slate-300 c-neutral-600 flex-none min-w-24px min-h-24px flex items-center justify-center shadow-sm px-8px"
          >
            {{ k }}
          </div>
        </div>
      </div>
      <div
        ref="searchResult"
        :style="{
          ...floatingStyles,
          visibility: openSearchResult ? 'visible' : 'hidden',
          transform: openSearchResult
            ? floatingStyles.transform + ' scale(1)'
            : floatingStyles.transform + ' scale(0.85)',
          transition: 'transform 0.25s',
        }"
        class="w-300px border border-gray-200 rounded-4px bg-white text-14px c-neutral-800 flex flex-col overflow-hidden shadow-sm"
      >
        <NuxtLink
          v-if="result.length"
          v-for="item in result"
          :key="item._path"
          :class="[
            'py-4px px-8px',
            isActiveSearchItem(item)
              ? 'bg-gray-100 c-neutral-800 fw-500'
              : 'bg-white c-neutral-600',
          ]"
          :href="item._path"
          @click="activeSearchItem = item._path"
        >
          {{ item.title }}
        </NuxtLink>
        <div v-else class="py-16px px-8px text-center">没有结果</div>
      </div>
      <div class="flex items-center gap-x-16px">
        <div
          class="text-24px cursor-pointer text-gray-700 hover:text-gray-900"
          @click="handleThemeConfigClick"
        >
          <IconsBrush />
        </div>
        <Teleport to="body" v-if="isThemeConfigOpen">
          <div
            class="fixed w-screen h-screen z-9999 left-0 top-0 bg-black/60"
            @click="isThemeConfigOpen = false"
          ></div>
          <div
            class="fixed z-99999 w-400px h-screen bg-white right-0 top-0 shadow-lg p-16px"
          >
            <div class="text-lg font-medium mb-16px">主题定制</div>
            <div class="flex gap-x-24px flex-wrap">
              <div
                class="flex flex-col items-center cursor-pointer"
                @click="handleThemeClick('qd')"
              >
                <div
                  class="bg-[rgb(124,102,255)] w-60px h-60px rounded mb-8px"
                ></div>
                <div class="c-gray-600 text-sm">千岛紫</div>
              </div>
              <div
                class="flex flex-col items-center cursor-pointer"
                @click="handleThemeClick('qh')"
              >
                <div class="bg-[#FF812C] w-60px h-60px rounded mb-8px"></div>
                <div class="c-gray-600 text-sm">奇货橙</div>
              </div>
              <div
                class="flex flex-col items-center cursor-pointer"
                @click="handleThemeClick('qdm')"
              >
                <div class="bg-[#1677FF] w-60px h-60px rounded mb-8px"></div>
                <div class="c-gray-600 text-sm">商家蓝</div>
              </div>
              <div
                class="flex flex-col items-center cursor-pointer"
                @click="handleThemeClick('mihua-light')"
              >
                <div class="bg-[#AEF056] w-60px h-60px rounded mb-8px"></div>
                <div class="c-gray-600 text-sm flex flex-col items-center">
                  <div>米花绿</div>
                  <div class="c-gray-500 text-xs">日照</div>
                </div>
              </div>
              <div
                class="flex flex-col items-center cursor-pointer"
                @click="handleThemeClick('mihua-dark')"
              >
                <div class="bg-[#AEF056] w-60px h-60px rounded mb-8px"></div>
                <div class="c-gray-600 text-sm flex flex-col items-center">
                  <div>米花绿</div>
                  <div class="c-gray-500 text-xs">暗黑</div>
                </div>
              </div>
            </div>
          </div>
        </Teleport>
        <div class="text-24px cursor-not-allowed text-gray-700 hover:text-gray-900">
          <a href="https://github.com/EchoTechFE/dangoui" target="_blank"><IconsGitHub /></a>
        </div>
      </div>
    </div>
  </div>
  <div
    class="doc-sidebar w-$doc-sidebar-w pt-$doc-header-h px-$doc-sidebar-padding fixed left-0 top-0 flex-none h-100vh border-r border-r-solid border-r-border-2 text-14px flex flex-col"
  >
    <OverlayScrollbarsComponent
      :options="{
        scrollbars: { autoHide: 'leave', autoHideDelay: 100 },
        overflow: { x: 'scroll', y: 'scroll' },
      }"
      defer
    >
      <div class="flex flex-col gap-y-16px">
        <div v-for="navItem in navigation" :key="navItem.title">
          <div class="px-8px c-neutral-800 fw-500 mb-8px">
            {{ navItem.title }}
          </div>
          <div class="flex flex-col gap-y-8px">
            <NuxtLink
              :class="[
                'h-40px flex items-center px-8px rounded-4px cursor-pointer',
                isNavItemActive(item)
                  ? 'bg-qd-purple-100 c-qd-purple-600 hover:bg-qd-purple-100 hover:c-qd-purple'
                  : 'bg-transparent c-neutral-700 hover:bg-bg-2 hover:c-neutral-700',
              ]"
              v-for="item in navItem.children ?? []"
              :key="item.title"
              :href="item._path"
            >
              {{ item.title }}
              <IconsFlask
                v-if="item.stage === 'alpha'"
                :class="[
                  'ml-4px',
                  isNavItemActive(item)
                    ? 'ml-4px c-qd-purple-600'
                    : 'c-neutral-500',
                ]"
              />
            </NuxtLink>
          </div>
        </div>
      </div>
    </OverlayScrollbarsComponent>
  </div>
  <slot />
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import { useFloating, offset } from '@floating-ui/vue'
import hotkeys from 'hotkeys-js'

const { data: navigation } = await useAsyncData('navigation', () =>
  fetchContentNavigation(),
)

const router = useRouter()
const route = useRoute()

const openSearchResult = ref(false)
const searchbar = ref<HTMLDivElement>()
const searchResult = ref<HTMLDivElement>()
const { floatingStyles } = useFloating(searchbar, searchResult, {
  placement: 'bottom-start',
  middleware: [offset(4)],
})

const shortcuts = ref(['⌘', 'K'])

function getOS() {
  var userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'],
    os = null

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS'
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS'
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows'
  } else if (/Android/.test(userAgent)) {
    os = 'Android'
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux'
  }

  return os
}

onMounted(() => {
  const os = getOS()
  if (os === 'Windows') {
    shortcuts.value = ['ctrl', 'k']
  }
  hotkeys('command+k, ctrl+k', () => {
    inputRef.value?.focus()
  })
})

onUnmounted(() => {
  hotkeys.unbind('command+k, ctrl+')
})

const inputRef = ref<HTMLInputElement>()

const keyword = ref('')
const result = ref<NavItem[]>(
  navigation.value?.flatMap((item) => item.children ?? []).slice(0, 5) ?? [],
)
const activeSearchItem = ref('')

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
  if (result.value.length === 0) {
    return
  }
  const idx = result.value.findIndex(
    (item) => item._path === activeSearchItem.value,
  )
  if (idx < 0) {
    activeSearchItem.value = result.value[0]._path!
  } else if (idx === 0) {
    activeSearchItem.value = result.value[result.value.length - 1]._path!
  } else {
    activeSearchItem.value = result.value[idx - 1]._path!
  }
}

function handleKeyDown() {
  if (result.value.length === 0) {
    return
  }
  const idx = result.value.findIndex(
    (item) => item._path === activeSearchItem.value,
  )
  if (idx < 0) {
    activeSearchItem.value = result.value[0]._path!
  } else if (idx === result.value.length - 1) {
    activeSearchItem.value = result.value[0]._path!
  } else {
    activeSearchItem.value = result.value[idx + 1]._path!
  }
}

function handleEnter() {
  if (activeSearchItem.value) {
    router.push(activeSearchItem.value)
    inputRef.value?.blur()
  }
}

const isThemeConfigOpen = ref(false)

function handleThemeConfigClick() {
  isThemeConfigOpen.value = true
}

function handleThemeClick(theme: string) {
  globalTheme.value = theme
  localStorage.setItem('DANGOUI_THEME', theme)
}

watch(
  keyword,
  (kw) => {
    const items =
      navigation.value
        ?.flatMap((item) => item.children ?? [])
        .filter((item) => {
          return item.title.toLowerCase().includes(kw.toLowerCase())
        })
        .slice(0, 5) ?? []
    result.value = items
    if (
      result.value.length > 0 &&
      !result.value.find((item) => item._path === activeSearchItem.value)
    ) {
      activeSearchItem.value = result.value[0]._path!
    }
  },
  {
    immediate: true,
  },
)

const isNavItemActive = (navItem: NavItem) => {
  return navItem._path === route.path
}
</script>

<style>
.doc-logo {
  margin-left: max(calc((100% - var(--doc-layout-max-w)) / 2), 0);
}

.doc-header-right {
  margin-right: max(
    calc((100% - var(--doc-layout-max-w)) / 2 + var(--doc-sidebar-padding)),
    var(--doc-sidebar-padding)
  );
}

.doc-sidebar {
  margin-left: max(calc((100% - var(--doc-layout-max-w)) / 2), 0px);
}

.doc-content {
  margin-left: max(
    calc((100% - var(--doc-layout-max-w)) / 2 + var(--doc-sidebar-w)),
    var(--doc-sidebar-w)
  );
  margin-right: max(calc((100% - var(--doc-layout-max-w)) / 2), 0px);
}

.doc-outline {
  display: none;
}

@media (min-width: 1440px) {
  .doc-logo {
    margin-left: max(
      calc((100% - var(--doc-layout-max-w)) / 2),
      var(--doc-sidebar-padding)
    );
  }

  .doc-header-right {
    margin-right: max(
      calc((100% - var(--doc-layout-max-w)) / 2 + var(--doc-sidebar-padding)),
      var(--doc-sidebar-padding)
    );
  }

  .doc-sidebar {
    margin-left: max(calc((100% - var(--doc-layout-max-w)) / 2), 0px);
  }

  .doc-content {
    margin-left: max(
      calc((100% - var(--doc-layout-max-w)) / 2 + var(--doc-sidebar-w)),
      var(--doc-sidebar-w)
    );
    margin-right: max(
      calc((100% - var(--doc-layout-max-w)) / 2 + var(--doc-outline-w)),
      var(--doc-outline-w)
    );
  }

  .doc-outline {
    display: block;
    margin-right: max(calc((100% - var(--doc-layout-max-w)) / 2), 0px);
  }
}
</style>
