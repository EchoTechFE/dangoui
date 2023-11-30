import ScrollView from '../components/ScrollView.vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('ScrollView', ScrollView)
})
