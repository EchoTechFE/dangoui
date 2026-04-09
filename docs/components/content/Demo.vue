<template>
  <section
    class="w-full flex rounded-lg border border-[var(--doc-border-light)] mb-32px text-14px overflow-hidden"
    style="height: 680px;"
  >
    <div class="flex-1 flex flex-col bg-[var(--doc-bg-primary)] min-w-0">
      <div class="w-full text-11px font-600 uppercase tracking-[0.8px] text-[var(--doc-text-tertiary)] bg-[var(--doc-bg-secondary)] px-14px py-14px border-b border-b-solid border-b-[var(--doc-border-light)]">{{ title }}</div>
      <div class="flex flex-col flex-1 overflow-hidden">
        <div v-if="$slots.default">
          <slot />
        </div>
        <div class="not-prose overflow-auto px-12px py-10px flex-1">
          <slot name="snippet" />
        </div>
      </div>
    </div>
    <div
      class="flex-none w-[375px] bg-bg-2 relative border-l border-l-solid border-l-[var(--doc-border-light)]"
    >
      <iframe ref="iframe" :src="demoPath" class="w-full h-full" style="padding: 0; border: none;" />
      <div
        v-if="consoleOpen"
        class="bottom-32px absolute left-0 right-0 h-200px z-10 bg-white border-t border-t-solid border-t-border-2 overflow-scroll"
      >
        <div
          v-for="(log, idx) in logs"
          :key="idx"
          class="px-4px py-2px c-gray-500"
        >
          {{ log }}
        </div>
      </div>
      <div
        class="h-32px bg-white border-t border-t-solid border-t-border-2 flex items-center px-8px select-none"
      >
        <div
          class="flex items-center cursor-pointer rounded-2px hover:bg-gray-100 px-4px"
          @click="consoleOpen = !consoleOpen"
        >
          <div class="i-mdi-code-greater-than mr-4px" />
          <div class="font-mono text-12px">{{ logs.length }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { globalTheme } from '~/composables/dumpling'

const props = defineProps<{
  idx: number
  path: string
  title: string
}>()

const iframe = ref<HTMLIFrameElement>()

// props.path from MDC: content:${path}:${filename}:${demoIdx}
// Content path in Nuxt Content strips N. prefix from both directory and filename.
// But pages/demos directories keep N. prefix (e.g., 2.bar, 1.style).
// So we reconstruct by: take the route path segments, strip N. from filename only,
// and for the category we must NOT strip N. from the first segment (it's the actual dir name).
const demoPath = computed(() => {
  const p = props.path
    .replace(/^content:/, '')
    .replace(/:(\d+)$/, '') // strip demo index at end
    .replace(/\.md$/, '') // strip .md extension

  // p is like 'bar:navigation-bar.md' or 'style:button.md'
  const colonIdx = p.lastIndexOf(':')
  const categoryPart = p.substring(0, colonIdx) // e.g. 'bar' or 'style'
  const filenameWithExt = p.substring(colonIdx + 1) // e.g. 'navigation-bar.md' or 'button.md'
  const filename = filenameWithExt.replace(/^(\d+)\./, '') // strip N. sort prefix

  // For the category: don't strip N. from first segment (it IS the directory name)
  // But we need to handle multi-segment category paths
  // categoryPart comes from the route path where N. IS stripped, but pages dirs keep N.
  // We need to look up the original directory name from the _file field in content API,
  // but we don't have that here. Instead, for known top-level categories,
  // we prepend the N. prefix based on the stripped route segment.
  // Actually, the pages dirs ARE named with N. prefix (1.style, 2.bar etc).
  // The content route strips N., so we must restore it.
  // For single-segment category like 'bar', we need to know it's '2.bar'.
  // The only way is to have a mapping.
  // For simplicity: if categoryPart is a known top-level category, use the pages dir as-is.
  // categoryPart = 'bar' → '2.bar', 'style' → '1.style', etc.
  const categoryMap: Record<string, string> = {
    'bar': '2.bar',
    'style': '1.style',
    'form': '3.form',
    'data': '4.data',
    'feedback': '5.feedback',
    'other': '6.other',
    'composables': '7.composables',
    'get-started': '0.get-started',
  }
  const category = categoryMap[categoryPart] ?? categoryPart

  return `/demos/${category}/${filename}/snippet${props.idx}`
})

const logs = ref<string[]>([])

const consoleOpen = ref(false)

watch(globalTheme, (theme) => {
  iframe.value?.contentWindow?.postMessage(
    {
      type: 'theme',
      message: theme,
    },
    '*',
  )
})

onMounted(() => {
  window.addEventListener('message', (message) => {
    if (message.source !== iframe.value?.contentWindow) {
      return
    }
    if (
      message.data?.type === 'log' &&
      message.data?.message.startsWith('[demo]')
    ) {
      logs.value.push(message.data.message)
    }
  })
})
</script>
