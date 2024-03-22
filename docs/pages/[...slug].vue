<template>
  <main class="doc-content mt-$doc-header-h px-32px">
    <ContentDoc
      class="prose prose-neutral flex-1 !max-w-full text-14px"
      :path="$route.path === '/' ? '/get-started/introduction' : $route.path"
    />
    <div class="grid grid-cols-2 gap-x-16px mb-32px mt-16px">
      <NuxtLink
        v-if="surround?.[0]"
        class="border border-solid border-border-2 transition cursor-pointer hover:border-qd-purple rounded-4px p-8px px-16px flex flex-col"
        :href="surround?.[0]?._path"
      >
        <div class="text-12px c-gray-500 mb-8px">上一篇</div>
        <div class="c-qd-purple text-14px font-medium">
          {{ surround?.[0]?.title }}
        </div>
      </NuxtLink>
      <div v-else />
      <NuxtLink
        v-if="surround?.[1]"
        class="border border-solid border-border-2 transition cursor-pointer hover:border-qd-purple rounded-4px p-8px px-16px flex flex-col items-end"
        :href="surround?.[1]?._path"
      >
        <div class="text-12px c-gray-500 mb-8px">下一篇</div>
        <div class="c-qd-purple text-14px font-medium">
          {{ surround?.[1]?.title }}
        </div>
      </NuxtLink>
      <div v-else />
    </div>
  </main>
  <div
    class="doc-outline fixed top-0 right-0 mt-$doc-header-h w-$doc-outline-w text-15px pl-16px border-l border-l-solid border-l-gray-200"
    v-if="md?.body?.toc?.links"
  >
    <div class="font-semibold mb-8px">本页包含</div>
    <div
      v-for="link in md.body.toc.links"
      :key="link.text"
      :class="[
        'lh-loose transition transition-all duration-200',
        isLinkActive(link)
          ? 'c-qd-purple-700 hover:c-qd-purple-700'
          : 'c-gray-500 hover:c-gray-800',
      ]"
    >
      <a :href="`#${link.id}`">{{ link.text }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThrottleFn, useEventListener } from '@vueuse/core'
definePageMeta({
  layout: 'doc',
})

const route = useRoute()

const { data: md } = await useAsyncData(route.path, () =>
  queryContent(
    route.path === '/' ? '/get-started/introduction' : route.path,
  ).findOne(),
)

const { data: surround } = await useAsyncData(`surround:` + route.path, () => {
  return queryContent()
    .only(['_path', 'title'])
    .where({
      _partial: false,
    })
    .findSurround(route.path === '/' ? '/get-started/introduction' : route.path)
})

const linksWithStatus = ref<{ id: string; isActive: boolean }[]>([])

function isLinkActive(link: { id: string }) {
  return linksWithStatus.value.some((l) => l.id === link.id && l.isActive)
}

const handleScroll = useThrottleFn(
  () => {
    if (md.value?.body?.toc?.links) {
      const links = md.value.body.toc.links
      const height = document.documentElement.clientHeight
      const linksWithRect = links.map((link) => {
        const el = document.querySelector(`#${link.id}`)!
        return {
          ...link,
          rect: el.getBoundingClientRect(),
        }
      })

      linksWithStatus.value = linksWithRect.map((link, idx) => {
        const { rect } = link
        let isActive = false

        if (rect.y > 0 && rect.y < height) {
          isActive = true
        } else if (rect.y < height) {
          // 看后一个是不是 active，如果后一个是 active，那么当前就是 active，如果是最后一个元素，那么也是 active
          const next = linksWithRect[idx + 1]
          if (next && next.rect.y > 0 && rect.y < height) {
            isActive = true
          } else if (!next) {
            isActive = true
          }
        }

        return {
          id: link.id,
          isActive,
        }
      })
    }
  },
  500,
  true,
)

useEventListener('scroll', handleScroll)

onMounted(() => {
  handleScroll()
})
</script>
