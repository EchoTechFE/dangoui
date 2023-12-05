<template>
  <div
    class="h-$doc-header-h fixed top-0 left-0 flex items-center justify-between w-full"
  >
    <div class="doc-logo pl-8px flex items-center">
      <Logo />
      <div class="fw-500">Dumpling</div>
      <div class="bg-orange c-white rounded-4px text-sm px-4px ml-4px">
        Beta
      </div>
    </div>
    <div class="doc-header-right flex items-center">
      <div>GitHub</div>
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

const { data: navigation } = await useAsyncData('navigation', () =>
  fetchContentNavigation(),
)

const route = useRoute()

const isNavItemActive = (navItem: NavItem) => {
  return navItem._path === route.path
}
</script>

<style>
.doc-logo {
  margin-left: max(
    calc((100% - var(--doc-layout-max-w)) / 2 + var(--doc-sidebar-padding)),
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
  margin-right: max(calc((100% - var(--doc-layout-max-w)) / 2), 0px);
}

.doc-outline {
  display: none;
}

@media (min-width: 1440px) {
  .doc-logo {
    margin-left: max(
      calc((100% - var(--doc-layout-max-w)) / 2 + var(--doc-sidebar-padding)),
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
