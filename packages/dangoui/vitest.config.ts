import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  define: {
    __WEB__: 'true',
    __UNI_PLATFORM__: '"h5"',
  },
  test: {
    globals: true,
    environment: 'happy-dom',
  },
})
