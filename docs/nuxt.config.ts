import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@unocss/nuxt', '@nuxt/image'],
  devtools: { enabled: true },
  imports: {
    dirs: ['business'],
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  alias: {
    business: '~/business',
  },
  app: {
    head: {
      titleTemplate: '%s - Dango UI',
    },
  },
  content: {
    highlight: {
      theme: 'min-light',
      preload: ['ts', 'js', 'vue', 'bash'],
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/get-started/introduction', '/get-started/quick-start', '/get-started/theme'],
    },
  },
  routeRules: {
    '/': { redirect: '/get-started/introduction' },
    '/business/**': { ssr: true },
    '/island-detail-preview': { prerender: false },
  },
  vite: {
    define: {
      __WEB__: 'true',
    },
    resolve: {
      alias: {
        'oniguruma-to-es': fileURLToPath(new URL('../node_modules/oniguruma-to-es/dist/index.mjs', import.meta.url)),
      },
    },
  },
})
