<template>
  <section
    class="w-full flex rounded-4px border border-solid border-border-2 h-667px mb-32px text-14px overflow-hidden"
  >
    <div class="flex-1 h-full flex flex-col overflow-hidden">
      <div
        class="h-40px w-full border-b border-b-solid border-b-border-2 flex-none flex justify-between items-center px-8px"
      >
        <div class="font-semibold">{{ title }}</div>
        <!-- <div>
          <div
            class="cursor-pointer hover:bg-gray-100 px-8px py-4px rounded-4px"
          >
            <div class="i-mdi-content-copy" />
          </div>
        </div> -->
      </div>
      <div class="px-16px flex flex-col flex-1 overflow-hidden">
        <div
          class="border-b border-b-dashed border-b-border-2 flex-none"
          v-if="$slots.default"
        >
          <slot />
        </div>
        <OverlayScrollbarsComponent
          class="not-prose py-16px px-8px flex-1"
          :options="{
            scrollbars: { autoHide: 'leave', autoHideDelay: 100 },
            overflow: { x: 'scroll', y: 'scroll' },
          }"
          defer
        >
          <slot name="snippet" />
        </OverlayScrollbarsComponent>
      </div>
    </div>
    <div
      class="flex-none flex-basis-375px border-l border-l-solid border-l-border-2 bg-bg-2 relative"
    >
      <iframe ref="iframe" :src="demoPath" class="w-full h-[calc(100%-32px)]" />
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
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

const props = defineProps<{
  idx: number
  path: string
  title: string
}>()

const iframe = ref<HTMLIFrameElement>()

const demoPath = computed(() => {
  const p = props.path
    .replace(/^content:/, '')
    .split(':')
    .map((s) => s.replace(/^(\d+)\./, '').replace(/\.md$/, ''))
    .join('/')
  return `/demos/${p}/snippet${props.idx}`
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
