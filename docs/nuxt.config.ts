// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@unocss/nuxt'],
  devtools: { enabled: true },
  app: {
    head: {
      titleTemplate: '%s - Dumpling',
    },
  },
  content: {
    highlight: {
      theme: 'min-light',
      preload: ['ts', 'js', 'vue', 'bash'],
    },
  },
})
