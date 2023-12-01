<template>
  <main class="doc-content flex mt-$doc-header-h px-32px items-start">
    <ContentDoc
      class="prose prose-neutral flex-1 !max-w-full text-14px"
      :path="$route.path === '/' ? '/get-started/introduction' : $route.path"
    />
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
</script>
