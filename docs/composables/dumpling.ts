export const currentApp = ref('qd')
export const isDarkMode = ref(false)
export const globalTheme = computed(() => isDarkMode.value ? `${currentApp.value}-dark` : currentApp.value)
