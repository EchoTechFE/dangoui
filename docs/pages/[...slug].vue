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
    class="doc-outline fixed top-0 right-0 mt-$doc-header-h w-$doc-outline-w text-14px pl-16px border-l border-l-solid border-l-gray-200"
    v-if="md?.body?.toc?.links"
  >
    <div class="font-semibold mb-8px">本页包含</div>
    <div
      v-for="link in md.body.toc.links"
      :key="link.text"
      class="lh-normal c-gray-500 hover:c-gray-800"
    >
      <a :href="`#${link.id}`">{{ link.text }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
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
</script>
