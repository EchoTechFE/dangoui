<template>
  <section
    class="w-full flex rounded-lg border border-[var(--doc-border-light)] mb-32px text-14px overflow-hidden"
    :style="{ height: `${previewHeight}px` }"
  >
    <!-- Preview (Left) -->
    <div
      class="flex-none relative flex flex-col bg-white"
      :style="{ width: `${previewWidth}px`, height: `${previewHeight}px` }"
    >
      <iframe
        ref="iframe"
        :src="demoPath"
        class="w-full"
        :style="{ height: `${previewHeight}px`, padding: 0, border: 'none', backgroundColor: 'transparent', display: 'block' }"
      />
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

    <!-- Code (Right) -->
    <div
      class="flex-1 flex flex-col items-start bg-[var(--doc-bg-primary)] min-w-0 overflow-auto border-l border-l-solid border-l-[var(--doc-border-light)]"
      :style="{ height: `${previewHeight}px` }"
    >
      <div class="preview-section-title">{{ title }}</div>
      <div class="not-prose w-full">
        <slot />
      </div>
      <div class="not-prose overflow-auto w-full">
        <slot name="snippet" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.not-prose :deep(pre) {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 0;
  display: block !important;
  gap: 0 !important;
}
.not-prose :deep(code) {
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 13px;
}
.not-prose :deep(.line) {
  padding: 0 4px;
  line-height: 1.4 !important;
  height: auto !important;
  min-height: 1.4em;
}
</style>

<script setup lang="ts">
import { globalTheme } from '~/composables/dumpling'

const props = defineProps<{
  idx: number
  path: string
  title: string
}>()

const iframe = ref<HTMLIFrameElement>()
// 设备尺寸规范（与 PhoneMockup.vue 保持一致，iPhone X/11 Pro/12 mini/13 mini）
// Frame 396×838, Screen 375×812, iframe容器 418×812
const previewHeight = ref(812) // iframe 高度 = Screen 高度
const previewWidth = ref(418)  // iframe 宽度 = Screen(375) + padding(43)

// props.path from MDC: content:${path}:${filename}:${demoIdx}
// Content path in Nuxt Content strips N. prefix from both directory and filename.
// But pages/demos directories keep N. prefix (e.g., 2.bar, 1.style).
// So we reconstruct by: take the route path segments, strip N. from filename only,
// and for the category we must NOT strip N. from the first segment (it's the actual dir name).
const demoPath = computed(() => {
  const p = props.path
    .replace(/^content:/, '')
    .replace(/:(\d+)$/, '')
    .replace(/\.md$/, '')

  const colonIdx = p.lastIndexOf(':')
  const categoryPart = p.substring(0, colonIdx)
  const filenameWithExt = p.substring(colonIdx + 1)
  const filename = filenameWithExt.replace(/^(\d+)\./, '')

  const categoryMap: Record<string, string> = {
    'bar': '2.bar',
    'style': '1.style',
    'form': '3.form',
    'data': '4.data',
    'feedback': '5.feedback',
    'other': '6.other',
    'composables': '7.composables',
    'get-started': '0.get-started',
    'business': 'business',
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
