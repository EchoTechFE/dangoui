<template>
  <section
    class="w-full flex rounded-lg border border-[var(--doc-border-light)] mb-32px text-14px overflow-hidden"
    :style="{ height: `${previewHeight}px` }"
  >
    <div
      class="flex-1 flex flex-col items-start bg-[var(--doc-bg-primary)] min-w-0 overflow-auto"
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
    <div
      class="flex-none w-[375px] bg-bg-2 relative border-l border-l-solid border-l-[var(--doc-border-light)] flex flex-col"
      :style="{ height: `${previewHeight}px` }"
    >
      <iframe ref="iframe" :src="demoPath" class="w-full" style="height: 667px; overflow-y: auto; padding: 0; border: none; background-color: transparent;" />
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

<style scoped>
.not-prose :deep(pre) {
  width: 100%;
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
const previewHeight = ref(667)

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
