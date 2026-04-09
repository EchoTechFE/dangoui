<template>
  <div class="typo-wrap flex flex-col gap-32px">
    <!-- Platform Bar -->
    <div class="typo-platform-bar flex items-center gap-2px h-32px px-2px bg-[var(--doc-bg-secondary)] rounded-[var(--radius-md)] ml-auto">
      <button
        v-for="p in platforms"
        :key="p.id"
        class="typo-plat flex items-center justify-center h-28px px-8px border-none rounded-[var(--radius-sm)] cursor-pointer transition-all gap-4px text-12px font-400"
        :class="currentPlatform === p.id ? 'bg-white shadow-sm font-500 text-gray-900' : 'bg-transparent text-gray-400'"
        @click="currentPlatform = p.id"
      >
        {{ p.name }}
      </button>
    </div>

    <!-- Font Families -->
    <div class="typo-families flex flex-col border border-[var(--doc-border-light)] rounded-[var(--radius-lg)] overflow-hidden">
      <div class="typo-family-hd text-11px font-600 uppercase tracking-[0.8px] text-[var(--doc-text-tertiary)] p-14px pb-10px border-b border-b-solid border-b-[var(--doc-border-light)] bg-[var(--doc-bg-secondary)]">字体栈 Font Stack</div>
      <div class="typo-family-row active flex items-center gap-0 p-14px border-b border-b-solid border-b-[var(--doc-border-light)] transition-all bg-[var(--doc-bg-primary)]">
        <div class="typo-family-chips flex items-center gap-6px flex-wrap">
          <span class="text-12px font-mono text-neutral-600">{{ platformFontFamily }}</span>
        </div>
      </div>
    </div>

    <!-- Install Command (Web only) -->
    <div v-if="currentPlatform === 'web'" class="border border-solid border-border-2 rounded-4px overflow-hidden">
      <div class="flex items-center justify-between p-8px border-b border-b-solid border-b-border-2">
        <div class="flex items-center gap-x-4px">
          <div
            v-for="tab in installTabs"
            :key="tab.id"
            class="cursor-pointer hover:bg-bg-2 c-neutral-800 rounded-4px px-8px py-4px text-14px"
            :class="activeTab === tab.id ? 'bg-bg-2' : ''"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </div>
        </div>
      </div>
      <div class="not-prose px-12px py-16px bg-gray-50" v-html="highlightedHtml"></div>
    </div>

    <!-- Three Columns -->
    <div class="typo-cols grid grid-cols-3 gap-24px items-start">
      <!-- Heading -->
      <div class="typo-col border border-[var(--doc-border-light)] rounded-[var(--radius-lg)] overflow-hidden">
        <div class="p-16px pb-14px bg-[var(--doc-bg-secondary)] border-b border-b-solid border-b-[var(--doc-border-light)]">
          <div class="text-14px font-500 text-[var(--doc-text-primary)] mb-2px">Heading</div>
          <div class="text-11px text-[var(--doc-text-tertiary)]">{{ platformFontFamily }}</div>
        </div>
        <div
          v-for="item in headings"
          :key="item.name"
          class="typo-row p-16px border-b border-b-solid border-b-[var(--doc-border-light)] cursor-default transition-all last:border-b-transparent hover:bg-[var(--doc-bg-secondary)]"
        >
          <div class="typo-sample text-[var(--doc-text-primary)] mb-10px leading-[1.3]" :style="headingStyle(item)">
            {{ item.label }}
          </div>
          <div class="typo-row-footer flex items-center gap-8px">
            <span class="typo-token text-11px font-500 font-mono text-[var(--doc-accent)] bg-[var(--doc-accent-bg)] rounded-[var(--radius-small)] p-2px px-7px tracking-[-0.2px] shrink-0">--font-{{ item.name }}</span>
            <span class="typo-dim text-11px text-[var(--doc-text-tertiary)] shrink-0">{{ item.size }} / {{ item.lh }}</span>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="typo-col border border-[var(--doc-border-light)] rounded-[var(--radius-lg)] overflow-hidden">
        <div class="p-16px pb-14px bg-[var(--doc-bg-secondary)] border-b border-b-solid border-b-[var(--doc-border-light)]">
          <div class="text-14px font-500 text-[var(--doc-text-primary)] mb-2px">Body</div>
          <div class="text-11px text-[var(--doc-text-tertiary)]">{{ platformFontFamily }}</div>
        </div>
        <div
          v-for="item in bodies"
          :key="item.name"
          class="typo-row p-16px border-b border-b-solid border-b-[var(--doc-border-light)] cursor-default transition-all last:border-b-transparent hover:bg-[var(--doc-bg-secondary)]"
        >
          <div class="typo-sample text-[var(--doc-text-primary)] mb-10px leading-[1.3]" :style="bodyStyle(item)">
            {{ item.label }}
          </div>
          <div class="typo-row-footer flex items-center gap-8px">
            <span class="typo-token text-11px font-500 font-mono text-[var(--doc-accent)] bg-[var(--doc-accent-bg)] rounded-[var(--radius-small)] p-2px px-7px tracking-[-0.2px] shrink-0">--font-{{ item.name }}</span>
            <span class="typo-dim text-11px text-[var(--doc-text-tertiary)] shrink-0">{{ item.size }} / {{ item.lh }}</span>
          </div>
        </div>
      </div>

      <!-- Number -->
      <div class="typo-col border border-[var(--doc-border-light)] rounded-[var(--radius-lg)] overflow-hidden">
        <div class="p-16px pb-14px bg-[var(--doc-bg-secondary)] border-b border-b-solid border-b-[var(--doc-border-light)]">
          <div class="text-14px font-500 text-[var(--doc-text-primary)] mb-2px">Number</div>
          <div class="text-11px text-[var(--doc-text-tertiary)]">数字字体 · Roboto</div>
        </div>
        <div
          v-for="item in numbers"
          :key="item.name"
          class="typo-row p-16px border-b border-b-solid border-b-[var(--doc-border-light)] cursor-default transition-all last:border-b-transparent hover:bg-[var(--doc-bg-secondary)]"
        >
          <div class="typo-sample text-[var(--doc-text-primary)] mb-10px leading-[1.3]" :style="numberStyle(item)">
            {{ item.label }}
          </div>
          <div class="typo-row-footer flex items-center gap-8px">
            <span class="typo-token text-11px font-500 font-mono text-[var(--doc-accent)] bg-[var(--doc-accent-bg)] rounded-[var(--radius-small)] p-2px px-7px tracking-[-0.2px] shrink-0">--font-{{ item.name }}</span>
            <span class="typo-dim text-11px text-[var(--doc-text-tertiary)] shrink-0">{{ item.size }} / {{ item.lh }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { codeToHtml } from 'shiki'

// Load fonts from Google Fonts
useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap' },
  ],
})

const platforms = [
  {
    id: 'web',
    name: 'Web',
    fontFamily: 'system-ui, sans-serif',
  },
  {
    id: 'ios',
    name: 'iOS',
    fontFamily: '-apple-system, sans-serif',
  },
  {
    id: 'android',
    name: 'Android',
    fontFamily: 'Roboto, "Noto Sans SC", sans-serif',
  },
  {
    id: 'harmony',
    name: 'HarmonyOS',
    fontFamily: '"HarmonyOS Sans SC", sans-serif',
  },
]

const currentPlatform = ref('web')

const installTabs = [
  { id: 'pnpm', label: 'pnpm', command: 'pnpm add unocss-preset-echo' },
  { id: 'yarn', label: 'yarn', command: 'yarn add unocss-preset-echo' },
  { id: 'npm', label: 'npm', command: 'npm install unocss-preset-echo' },
]

const activeTab = ref('pnpm')

const highlightedHtml = ref('')

watch(activeTab, async () => {
  const cmd = installTabs.find(t => t.id === activeTab.value)?.command ?? ''
  let html = await codeToHtml(cmd, {
    lang: 'bash',
    theme: 'min-light',
  })
  // 去掉 Shiki 自带的背景色和文字颜色内联样式
  html = html.replace(/style="[^"]*background-color:\s*#[a-fA-F0-9]+[^"]*"/g, '')
  html = html.replace(/style="[^"]*color:\s*#[a-fA-F0-9]+[^"]*"/g, '')
  highlightedHtml.value = html
}, { immediate: true })

// Full CSS font-family for rendering and display
const platformFontFamily = computed(() => {
  return platforms.find(p => p.id === currentPlatform.value)?.fontFamily ?? '-apple-system, "PingFang SC", sans-serif'
})


const headings = [
  { name: 'h1', size: '24px', lh: '30px', label: '回响设计系统' },
  { name: 'h2', size: '20px', lh: '26px', label: '回响设计系统' },
  { name: 'h3', size: '18px', lh: '25px', label: '回响设计系统' },
  { name: 'h4', size: '16px', lh: '24px', label: '回响设计系统' },
  { name: 'h5', size: '14px', lh: '22px', label: '回响设计系统' },
  { name: 'h6', size: '12px', lh: '18px', label: '回响设计系统' },
  { name: 'h7', size: '11px', lh: '13px', label: '回响设计系统' },
  { name: 'h8', size: '10px', lh: '11px', label: '回响设计系统' },
]

const bodies = [
  { name: 'b1', size: '24px', lh: '30px', label: '回响设计系统' },
  { name: 'b2', size: '20px', lh: '26px', label: '回响设计系统' },
  { name: 'b3', size: '18px', lh: '25px', label: '回响设计系统' },
  { name: 'b4', size: '16px', lh: '24px', label: '回响设计系统' },
  { name: 'b5', size: '14px', lh: '22px', label: '回响设计系统' },
  { name: 'b6', size: '12px', lh: '18px', label: '回响设计系统' },
  { name: 'b7', size: '11px', lh: '13px', label: '回响设计系统' },
  { name: 'b8', size: '10px', lh: '11px', label: '回响设计系统' },
]

const numbers = [
  { name: 'n1', size: '24px', lh: '30px', label: '¥12,800.00' },
  { name: 'n2', size: '20px', lh: '26px', label: '¥12,800.00' },
  { name: 'n3', size: '18px', lh: '25px', label: '¥12,800.00' },
  { name: 'n4', size: '16px', lh: '24px', label: '¥12,800.00' },
  { name: 'n5', size: '14px', lh: '22px', label: '¥12,800.00' },
  { name: 'n6', size: '12px', lh: '18px', label: '¥12,800' },
  { name: 'n7', size: '11px', lh: '13px', label: '¥12,800' },
]

// Heading style with platform-specific font
const headingStyle = (item: { name: string; size: string; lh: string }) => {
  return {
    fontFamily: platformFontFamily.value,
    fontSize: item.size,
    lineHeight: item.lh,
    fontWeight: '500',
  }
}

// Body style with platform-specific font
const bodyStyle = (item: { name: string; size: string; lh: string }) => {
  return {
    fontFamily: platformFontFamily.value,
    fontSize: item.size,
    lineHeight: item.lh,
    fontWeight: '400',
  }
}

// Number style - always Roboto
const numberStyle = (item: { name: string; size: string; lh: string }) => {
  return {
    fontFamily: '"Roboto", -apple-system, "PingFang SC", sans-serif',
    fontSize: item.size,
    lineHeight: item.lh,
    fontWeight: '500',
  }
}
</script>

