// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@unocss/nuxt', "@nuxt/image"],
  devtools: { enabled: true },
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
})